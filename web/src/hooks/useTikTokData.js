import { useState, useEffect } from 'react';
import { fetchUserVideos, fetchVideoComments, fetchUserProfile } from '../services/tiktokApi';

const MAX_FOLLOWERS = parseInt(import.meta.env.VITE_MAX_FOLLOWERS, 10) || Infinity;

function mapCommenterToFollower(commenterData) {
  const { user, comments, firstVideoDesc } = commenterData;
  const sorted = [...comments].sort((a, b) => (b.create_time || 0) - (a.create_time || 0));

  return {
    id: user.uniqueId || `user-${user.id}`,
    username: user.uniqueId || 'unknown',
    avatar: user.avatarThumb || user.avatarMedium || '',
    createdAt: sorted[0]?.create_time
      ? new Date(sorted[0].create_time * 1000).toISOString()
      : new Date().toISOString(),
    origin: firstVideoDesc || '',
    comments: sorted.map(c => ({
      content: c.text || '',
      date: c.create_time ? new Date(c.create_time * 1000).toISOString() : new Date().toISOString(),
      likes: c.diggCount || 0,
    })),
  };
}

export function useTikTokData(username) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followerCount, setFollowerCount] = useState(null);

  useEffect(() => {
    if (!username) {
      setFollowers([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const profilePromise = fetchUserProfile(username).catch(() => null);

        const videoRes = await fetchUserVideos(username, 30);
        const videos = videoRes.data || [];

        if (cancelled) return;
        if (videos.length === 0) {
          setFollowers([]);
          setLoading(false);
          return;
        }

        const profileData = await profilePromise;
        if (!cancelled && profileData) {
          setFollowerCount(profileData.followerCount ?? null);
        }

        const commenterMap = new Map();

        for (const video of videos) {
          if (cancelled) return;
          if (commenterMap.size >= MAX_FOLLOWERS) break;

          let commentRes;
          try {
            commentRes = await fetchVideoComments(video.id, 50);
          } catch {
            continue;
          }

          const comments = commentRes.data || [];
          for (const comment of comments) {
            if (commenterMap.size >= MAX_FOLLOWERS) break;

            const author = comment.user || comment.author;
            if (!author || !author.uniqueId) continue;

            const key = author.uniqueId;
            if (!commenterMap.has(key)) {
              commenterMap.set(key, {
                user: author,
                comments: [],
                firstVideoDesc: video.desc || `tiktok.com/@${username}/video/${video.id}`,
              });
            }
            commenterMap.get(key).comments.push({
              text: comment.text || comment.content,
              create_time: comment.create_time,
              diggCount: comment.diggCount || comment.likes_count || 0,
            });
          }
        }

        if (!cancelled) {
          const result = Array.from(commenterMap.values()).map(mapCommenterToFollower);
          setFollowers(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load TikTok data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  return { followers, loading, error, followerCount };
}
