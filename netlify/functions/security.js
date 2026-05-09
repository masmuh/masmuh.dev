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
    // Blocked requests (403 = WAF/firewall block)
    threats: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 1, filter: { datetime_geq: "${start}", datetime_leq: "${end}", edgeResponseStatus: 403 }) { count } } } }`,

    // Top countries with blocked requests
    countries: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 10, filter: { datetime_geq: "${start}", datetime_leq: "${end}", edgeResponseStatus: 403 }, orderBy: [count_DESC]) { count dimensions { clientCountryName } } } } }`,

    // Total requests
    total: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 1, filter: { datetime_geq: "${start}", datetime_leq: "${end}" }) { count } } } }`,
  };

  try {
    const [threatRes, countriesRes, totalRes] = await Promise.all([
      graphql(queries.threats),
      graphql(queries.countries),
      graphql(queries.total),
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        threatsBlocked,
        requestsToday,
        topCountries,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
