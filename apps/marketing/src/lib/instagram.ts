// Server-only: reads the latest posts from the Instagram API with Instagram Login, so the token never reaches the browser; any failure returns an empty feed and the section hides itself.

import 'server-only';

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string;
  kind: 'image' | 'video' | 'carousel';
  postedAt: string;
}

export interface InstagramFeed {
  username: string;
  profileUrl: string;
  posts: InstagramPost[];
  /** Why the feed is empty, shown only in development so the setup can be fixed. */
  problem?: string;
}

interface MediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const API = 'https://graph.instagram.com/v21.0/me/media';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
// New posts reach the site within half an hour without a redeploy.
const REFRESH_SECONDS = 1800;

export async function getInstagramFeed(limit = 9): Promise<InstagramFeed> {
  const username = (process.env.INSTAGRAM_USERNAME ?? '').replace(/^@/, '').trim();
  const profileUrl = username ? `https://www.instagram.com/${username}/` : 'https://www.instagram.com/';
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!token) return { username, profileUrl, posts: [], problem: 'INSTAGRAM_ACCESS_TOKEN is empty in apps/marketing/.env.local.' };

  try {
    const url = `${API}?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { next: { revalidate: REFRESH_SECONDS, tags: ['instagram'] } });
    if (!res.ok) {
      // Meta answers an expired or revoked token with 400/401 and an OAuthException.
      const body = await res.text();
      console.error('[instagram] feed request failed:', res.status, body.slice(0, 300));
      return { username, profileUrl, posts: [], problem: `Instagram replied ${res.status}. The token may have expired (they last 60 days).` };
    }

    const json = (await res.json()) as { data?: MediaItem[] };
    const posts = (json.data ?? [])
      .map((m): InstagramPost | null => {
        // A video's media_url is the video itself; its still frame is thumbnail_url.
        const imageUrl = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
        if (!imageUrl) return null;
        return {
          id: m.id,
          imageUrl,
          permalink: m.permalink,
          caption: (m.caption ?? '').trim(),
          kind: m.media_type === 'VIDEO' ? 'video' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
          postedAt: m.timestamp,
        };
      })
      .filter((p): p is InstagramPost => p !== null);

    return { username, profileUrl, posts };
  } catch (error) {
    console.error('[instagram] feed request threw:', error);
    return { username, profileUrl, posts: [], problem: 'Could not reach Instagram.' };
  }
}
