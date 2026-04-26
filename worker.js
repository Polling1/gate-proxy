export default {
  async fetch(request, env, ctx) {
    // 处理跨域预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const query = url.search;

    // 转发到 Gate.io API
    const gateUrl = `https://api.gateio.ws${path}${query}`;

    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        headers[key] = value;
      }
    }

    const response = await fetch(gateUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.body : null,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};
