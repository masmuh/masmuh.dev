exports.handler = async (event) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: 'Missing url' };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { statusCode: response.status, body: 'Failed to fetch' };
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch {
    return { statusCode: 502, body: 'Proxy error' };
  }
};
