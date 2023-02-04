import SECRETS from './secrets.json';
import type { TiltifyDonationProgress } from './types';

const API_URL = 'https://tiltify.com/api/v3';
const CAUSE_ID = '7886';

const REQUIRED_HEADERS = new Headers({
  'Content-Type': 'text/json',
  Authorization: `Bearer ${SECRETS.API_KEY}`,
});

export const getCurrentDonationProgress = async (): Promise<TiltifyDonationProgress> => {
  return await fetch(
    `${API_URL}/causes/${CAUSE_ID}/fundraising-events`,
    {
      method: 'GET',
      headers: REQUIRED_HEADERS,
    },
  ).then(async (response) => {
    if (response.ok) {
      return await Promise.resolve(
        response.json().then((json) => ({
          current: json.data[0].totalAmountRaised,
          goal: json.data[0].fundraiserGoalAmount,
        })),
      );
    } else {
      return await Promise.reject(new Error('Response failed'));
    }
  });
};
