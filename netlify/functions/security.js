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
    threats: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { firewallEventsAdaptiveGroups(limit: 1, filter: { date_geq: "${start}", action: "block" }) { count } } } }`,
    countries: `{ viewer { zones(filter: {zoneTag: "${zoneId}"}) { firewallEventsAdaptiveGroups(limit: 5, filter: { date_geq: "${start}", action: "block" }, orderBy: [count_DESC]) { count dimensions { country } } } } }`,
  };

  try {
    const [threatRes, countriesRes] = await Promise.all([
      graphql(queries.threats),
      graphql(queries.countries),
    ]);

    const zones = (d) => d?.data?.viewer?.zones?.[0] || {};
    const threatGroups = zones(threatRes).firewallEventsAdaptiveGroups || [];
    const threatsBlocked = threatGroups.reduce((sum, g) => sum + g.count, 0);
    const topCountries = (zones(countriesRes).firewallEventsAdaptiveGroups || []).map((g) => ({
      country: g.dimensions?.country || 'Unknown',
      count: g.count,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        threatsBlocked,
        requestsToday: 0,
        topCountries,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
