const CF_API = 'https://api.cloudflare.com/client/v4/graphql';

async function graphql(query) {
  const token = process.env.CF_API_TOKEN;
  if (!token) throw new Error('CF_API_TOKEN not configured');
  const res = await fetch(CF_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json;
}

exports.handler = async () => {
  const zoneId = process.env.CF_ZONE_ID;
  if (!zoneId) {
    return { statusCode: 500, body: JSON.stringify({ error: 'CF_ZONE_ID not configured' }) };
  }

  // Free plan: max 24h query window — use 23h for margin
  const nowMs = Date.now();
  const start = new Date(nowMs - 82800000).toISOString();
  const end = new Date(nowMs).toISOString();

  const queries = {
    threats: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 1, filter: { datetime_geq: "${start}", datetime_leq: "${end}", edgeResponseStatus: 403 }) { count } } } }`,

    countries: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 10, filter: { datetime_geq: "${start}", datetime_leq: "${end}", edgeResponseStatus: 403 }, orderBy: [count_DESC]) { count dimensions { clientCountryName } } } } }`,

    total: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 1, filter: { datetime_geq: "${start}", datetime_leq: "${end}" }) { count } } } }`,

    timeline: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 24, filter: { datetime_geq: "${start}", datetime_leq: "${end}", edgeResponseStatus: 403 }, orderBy: [datetimeHour_ASC]) { count dimensions { datetimeHour } } } } }`,
  };

  try {
    const [threatRes, countriesRes, totalRes, timelineRes] = await Promise.all([
      graphql(queries.threats),
      graphql(queries.countries),
      graphql(queries.total),
      graphql(queries.timeline),
    ]);

    const zones = (d) => d?.data?.viewer?.zones?.[0] || {};
    const threatGroups = zones(threatRes).httpRequestsAdaptiveGroups || [];
    const threatsBlocked = threatGroups.reduce((sum, g) => sum + g.count, 0);

    const totalGroups = zones(totalRes).httpRequestsAdaptiveGroups || [];
    const requestsToday = totalGroups.reduce((sum, g) => sum + g.count, 0);

    const topCountries = (zones(countriesRes).httpRequestsAdaptiveGroups || []).map((g) => ({
      country: g.dimensions?.clientCountryName || 'Unknown',
      count: g.count,
    }));

    const timeline = (zones(timelineRes).httpRequestsAdaptiveGroups || []).map((g) => {
      const raw = g.dimensions?.datetimeHour || '';
      const hour = raw.length >= 13 ? raw.slice(11, 13) : '';
      return {
        hour: hour + ':00',
        count: g.count,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        threatsBlocked,
        requestsToday,
        topCountries,
        timeline,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
