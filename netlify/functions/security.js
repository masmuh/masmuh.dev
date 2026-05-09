const CF_API = 'https://api.cloudflare.com/client/v4/graphql';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

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

  const start = daysAgo(7);

  const queries = {
    threats: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { firewallEventsAdaptive(filter: { date_geq: "${start}", action: "block" }) { count sum { threats } } } } }`,
    countries: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { firewallEventsAdaptiveGroups(limit: 5, filter: { date_geq: "${start}", action: "block" }, orderBy: [count_DESC]) { count dimensions { country } } } } }`,
    requests: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { httpRequestsAdaptiveGroups(limit: 1, filter: { date_geq: "${start}" }) { count sum { bytes } } } } }`,
  };

  try {
    const [threatRes, countriesRes, requestsRes] = await Promise.all([
      graphql(queries.threats),
      graphql(queries.countries),
      graphql(queries.requests),
    ]);

    const zones = (d) => d?.data?.viewer?.zones?.[0] || {};
    const threats = zones(threatRes).firewallEventsAdaptive || {};
    const topCountries = (zones(countriesRes).firewallEventsAdaptiveGroups || []).map((g) => ({
      country: g.dimensions?.country || 'Unknown',
      count: g.count,
    }));
    const requestCount = zones(requestsRes).httpRequestsAdaptiveGroups?.[0]?.count || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({
        threatsBlocked: threats.count || 0,
        requestsToday: requestCount,
        topCountries,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
