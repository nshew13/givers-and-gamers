import type { TwitchAccessToken, TwitchStreamsData, TwitchStreamsResponse } from './types';

export class Twitch {
    private static readonly _CLIENT_ID = 'ojbmnmm8my0gb7mkb0k6rv4ime0pv4';
    private static _ACCESS_TOKEN: TwitchAccessToken;

    private static async _fetchAccessToken(force = false): Promise<void> {
        const headers = new Headers({
            "Content-Type": "text/json",
        });

        if (Twitch._ACCESS_TOKEN?.access_token && !force) {
            return Promise.resolve();
        }

        const response = await fetch('https://giversandgamers.org/server/twitch.php', { method: 'GET', headers });
        if (response.ok) {
            return response.json().then((json) => {
                Twitch._ACCESS_TOKEN = json;
            }).finally(() => {
                Promise.resolve();
            });
        } else {
            return Promise.reject("Response failed");
        }
    }

    private static async _fetchStreams(users: Array<string>): Promise<Array<TwitchStreamsData>> {
        const headers = new Headers({
            "Content-Type": "text/json",
            Authorization: `Bearer ${Twitch._ACCESS_TOKEN.access_token}`,
            'Client-ID': Twitch._CLIENT_ID,
        });

        const userParams = users.map((user) => `user_login=${user}`).join('&');

        const response = await fetch(`https://api.twitch.tv/helix/streams?${userParams}`, { method: 'GET', headers });
        if (response.ok) {
            return response.json().then((json: TwitchStreamsResponse) => json.data);
        } else {
            return Promise.reject("Response failed");
        }
    }

    public static async isCurrentlyStreaming(users: Array<string>): Promise<boolean> {
        await Twitch._fetchAccessToken();
        const streamsData = await Twitch._fetchStreams(users);
        return !!streamsData.length;
    }
}
