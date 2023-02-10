import type { TwitchAccessToken, TwitchStreamsData, TwitchStreamsResponse } from './types';
import CONFIG from "^config/config.json";

const CLIENT_ID = 'ojbmnmm8my0gb7mkb0k6rv4ime0pv4';
let accessToken: TwitchAccessToken;

const fetchAccessToken = async (force = false): Promise<void> => {
  const headers = new Headers({
    'Content-Type': 'text/json',
  });

  // reuse an existing token unless forced to re-fetch
  if (accessToken?.access_token !== undefined && !force) {
    await Promise.resolve();
    return;
  }

  const response = await fetch('https://giversandgamers.org/server/twitch.php', { method: 'GET', headers });
  if (response.ok) {
    await response.json().then((json) => {
      accessToken = json;
    });
  } else {
    await Promise.reject(new Error('Response failed'));
  }
};

const fetchStreams = async (users: string[]): Promise<TwitchStreamsData[]> => {
  const headers = new Headers({
    'Content-Type': 'text/json',
    Authorization: `Bearer ${accessToken.access_token}`,
    'Client-ID': CLIENT_ID,
  });

  const userParams = users.map((user) => `user_login=${user}`).join('&');

  const response = await fetch(`https://api.twitch.tv/helix/streams?${userParams}`, { method: 'GET', headers });
  if (response.ok) {
    return await response.json().then((json: TwitchStreamsResponse) => json.data);
  } else {
    return await Promise.reject(new Error('Response failed'));
  }
};

export const isCurrentlyStreaming = async (users: string[]): Promise<boolean> => {
  if (CONFIG._dev.show_now_streaming === true) {
    return true;
  }
  await fetchAccessToken();
  const streamsData = await fetchStreams(users);
  return !(streamsData.length === 0);
};
