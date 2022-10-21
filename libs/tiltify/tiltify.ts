import SECRETS from './secrets.json';
import { EHttpMethod } from 'libs/types';
import { ITiltifyDonation } from './types';

export class Tiltify {
    private static readonly _CAUSE_ID = '7886';
    
    
    private static readonly _REQUIRED_HEADERS = new Headers({
        'Content-Type': 'text/json',
        'Authorization': `Bearer ${SECRETS.API_KEY}`,
    });

    private static readonly _POLLING_INTERVAL_MSEC = 10_000;
    public static get POLLING_INTERVAL_MSEC(): number {
        return Tiltify._POLLING_INTERVAL_MSEC;
    }

    private static readonly _API_URL = 'https://tiltify.com/api/v3';
    private static readonly _API_FORMAT = '.json';


    public static getCurrentDonationsTotal(): Promise<ITiltifyDonation> {
        return fetch(
            `${Tiltify._API_URL}/causes/${Tiltify._CAUSE_ID}/fundraising-events`,
            {
                method: EHttpMethod.GET,
                headers: Tiltify._REQUIRED_HEADERS,
            }
        ).then((response) => {
            if (response.ok) {
                return Promise.resolve(response.json().then(
                    (json) => ({
                        current: json.data[0].totalAmountRaised,
                        goal: json.data[0].fundraiserGoalAmount,
                    })
                ));
            } else {
                return Promise.reject('Response failed');
            }
        });
    }
}
