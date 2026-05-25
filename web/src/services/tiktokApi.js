const API_BASE = import.meta.env.VITE_TIKTOK_API_URL || 'http://localhost:8000';

class TiktokApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TiktokApiError';
    this.status = status;
  }
}

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new TiktokApiError(
      `API error: ${res.status} ${res.statusText}`,
      res.status
    );
  }
  return res.json();
}

export async function fetchUserProfile(username) {
  return request(`/users/${username}`);
}

export async function fetchUserVideos(username, count = 30) {
  return request(`/users/${username}/videos?count=${count}`);
}

export async function fetchVideoComments(videoId, count = 50) {
  return request(`/videos/${videoId}/comments?count=${count}`);
}
