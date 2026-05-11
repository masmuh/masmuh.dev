async function fetchDevToPosts(username, perPage) {
  try {
    const url = `https://dev.to/api/articles?username=${username}&per_page=${perPage}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const posts = await response.json();
    
    const simplifiedPosts = posts.map(post => ({
      title: post.title,
      description: post.description || post.social_media_text || '',
      url: post.url,
      publishedAt: post.published_at,
      tags: post.tag_list || [],
      readingTime: post.reading_time_minutes || 0,
      coverImage: post.cover_image || null
    }));
    
    return simplifiedPosts;
  } catch (error) {
    console.error('Error fetching DEV.to posts:', error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  try {
    const username = 'insight105';
    const params = event.queryStringParameters || {};
    const perPage = parseInt(params.per_page, 10) || 30;
    const posts = await fetchDevToPosts(username, perPage);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: posts,
        count: posts.length
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};