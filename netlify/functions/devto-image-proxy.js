const ALLOWED_HOSTS = ['dev-to-uploads.s3.amazonaws.com'];

exports.handler = async (event) => {
  const urlParam = event.queryStringParameters.url;
  if (!urlParam) {
    return { statusCode: 400, body: 'Missing url' };
  }

  try {
    const parsed = new URL(urlParam);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return { statusCode: 403, body: 'Forbidden' };
    }

    const response = await fetch(urlParam);
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
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch {
    return { statusCode: 502, body: 'Proxy error' };
  }
};
