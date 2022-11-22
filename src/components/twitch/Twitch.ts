import type { TwitchAccessToken, TwitchStreamsResponse } from './types';

export class Twitch {
    private static _ACCESS_TOKEN: TwitchAccessToken;

    public static async getAccessToken(): Promise<TwitchAccessToken | void> {
        const headers = new Headers({
            "Content-Type": "text/json",
        });

        return fetch('https://giversandgamers.org/server/twitch.php', { method: 'GET', headers }).then(
            (response: Response) => {
                if (response.ok) {
                    return Promise.resolve(
                        response.json().then((json) => {
                            Twitch._ACCESS_TOKEN = json;
                        })
                    );
                } else {
                    return Promise.reject("Response failed");
                }
            }
        );
    }

    public static async isCurrentlyStreaming(users: Array<string>): Promise<boolean | void> {
        const headers = new Headers({
            "Content-Type": "text/json",
            Authorization: `Bearer ${Twitch._ACCESS_TOKEN.access_token}`,
        });

        const userParams = users.map((user) => `user_login=${user}`).join('&');

        return fetch(`https://api.twitch.tv/helix/streams?${userParams}`, { method: 'GET', headers }).then(
            (response: Response) => {
                 if (response.ok) {
                    return Promise.resolve(
                        response.json().then((json: TwitchStreamsResponse) => {
                            return !!json.data.length;
                        })
                    );
                } else {
                    return Promise.reject("Response failed");
                }
            }
        );
    }
}
