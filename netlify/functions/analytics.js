const { BetaAnalyticsDataClient } = require('@google-analytics/data');

function getClient() {
  const key = process.env.GA_SERVICE_ACCOUNT;
  if (key) {
    try { return new BetaAnalyticsDataClient({ credentials: JSON.parse(key) }); } catch {}
  }
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA_CLIENT_EMAIL,
      private_key: (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    },
  });
}

const property = () => `properties/${process.env.GA_PROPERTY_ID}`;

async function runReport(opts) {
  const client = getClient();
  try {
    const [r] = await client.runReport({ property: property(), dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }], ...opts });
    return r;
  } catch {
    const [r] = await client.runReport({ property: property(), dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }], ...opts });
    return r;
  }
}

function val(row, i) {
  return parseInt(row?.metricValues?.[i]?.value) || 0;
}

function fval(row, i) {
  return parseFloat(row?.metricValues?.[i]?.value) || 0;
}

async function getOverview() {
  const r = await runReport({
    metrics: [
      { name: 'activeUsers' }, { name: 'newUsers' }, { name: 'eventCount' },
      { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'totalUsers' },
    ],
  });
  const row = r.rows?.[0];
  return {
    activeUsers: val(row, 0), newUsers: val(row, 1), eventCount: val(row, 2),
    sessions: val(row, 3), pageViews: val(row, 4), avgEngagement: fval(row, 5), totalUsers: val(row, 6),
  };
}

async function getTopPages() {
  const r = await runReport({
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'bounceRate' }],
    orderBy: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 7,
  });
  return (r.rows || []).map(row => ({
    path: row.dimensionValues?.[0]?.value || '/',
    views: val(row, 0), users: val(row, 1), bounce: fval(row, 2),
  }));
}

async function getTopCities() {
  const r = await runReport({
    dimensions: [{ name: 'city' }],
    metrics: [{ name: 'activeUsers' }],
    orderBy: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 5,
  });
  return (r.rows || []).map(row => ({
    city: row.dimensionValues?.[0]?.value || '(not set)',
    users: val(row, 0),
  }));
}

async function getTrafficSource() {
  const r = await runReport({
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBy: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
  return (r.rows || []).map(row => ({
    source: row.dimensionValues?.[0]?.value || 'Direct / None',
    sessions: val(row, 0), users: val(row, 1),
  }));
}

async function getNewReturning() {
  const r = await runReport({
    dimensions: [{ name: 'newVsReturning' }],
    metrics: [{ name: 'totalUsers' }],
  });
  const rows = r.rows || [];
  const newU = rows.find(r => r.dimensionValues?.[0]?.value === 'new')?.metricValues?.[0]?.value || 0;
  const retU = rows.find(r => r.dimensionValues?.[0]?.value === 'returning')?.metricValues?.[0]?.value || 0;
  const total = parseInt(newU) + parseInt(retU);
  return {
    newUsers: parseInt(newU), returningUsers: parseInt(retU),
    newPct: total > 0 ? ((parseInt(newU) / total) * 100).toFixed(1) : 0,
    returningPct: total > 0 ? ((parseInt(retU) / total) * 100).toFixed(1) : 0,
  };
}

async function getTrend() {
  const r = await runReport({
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'newUsers' }, { name: 'activeUsers' }],
    orderBy: [{ dimension: { dimensionName: 'date' }, desc: false }],
    limit: 28,
  });
  return (r.rows || []).map(row => ({
    date: row.dimensionValues?.[0]?.value || '',
    newUsers: val(row, 0), activeUsers: val(row, 1),
  }));
}

async function getNewVsReturningTrend() {
  const r = await runReport({
    dimensions: [{ name: 'date' }, { name: 'newVsReturning' }],
    metrics: [{ name: 'totalUsers' }],
    orderBy: [{ dimension: { dimensionName: 'date' }, desc: false }],
    limit: 56,
  });
  const byDate = {};
  for (const row of r.rows || []) {
    const date = row.dimensionValues?.[0]?.value || '';
    const type = row.dimensionValues?.[1]?.value || '';
    const users = val(row, 0);
    if (!byDate[date]) byDate[date] = { date, newUsers: 0, returningUsers: 0 };
    if (type === 'new') byDate[date].newUsers += users;
    else byDate[date].returningUsers += users;
  }
  return Object.values(byDate);
}

exports.handler = async () => {
  const propId = process.env.GA_PROPERTY_ID;
  if (!propId) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GA_PROPERTY_ID not configured' }) };
  }
  try {
    const [overview, pages, cities, trafficSource, newReturning, trend, nrTrend] = await Promise.all([
      getOverview(), getTopPages(), getTopCities(), getTrafficSource(), getNewReturning(), getTrend(), getNewVsReturningTrend(),
    ]);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overview, pages, cities, trafficSource, newReturning, trend, nrTrend }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
