export type TwitchAccessToken = {
    access_token: string;
    expires_in: number;
    token_type: "bearer";
}

export type TwitchStreamsData = {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: Array<string>;
    is_mature: boolean;
}

export type TwitchStreamsResponse = {
    data: Array<TwitchStreamsData>;
    pagination: {
        cursor?: string;
    }
}
