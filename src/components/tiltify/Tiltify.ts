import type { TiltifyDonationProgress, TiltifyGolfHandicap } from './types';
import CONFIG from '^config/config.json';

// const API_URL = '/server/p2p.php?action='; // dev
const API_URL = 'https://www.giversandgamers.org/server/p2p.php?action=';

export const getCurrentDonationProgress = async (): Promise<TiltifyDonationProgress> => {
  return await fetch(`${API_URL}fetchFundraisingEvents`, { method: 'GET' })
    .then(async (response) => {
      if (response.ok) {
        return await Promise.resolve(
          response.json().then((json) => ({
            current: parseFloat(json.data?.[0]?.total_amount_raised?.value),
            goal: parseFloat(json.data?.[0]?.goal?.value),
          })),
        );
      } else {
        return await Promise.reject(new Error('Response failed'));
      }
    });
};

export const getGolfHandicaps = async (): Promise<TiltifyGolfHandicap[]> => {
  return await fetch(`${API_URL}fetchCampaigns`, { method: 'GET' })
    .then(async (response) => {
      if (response.ok) {
        return await Promise.resolve(
          response.json().then((json) => json.data?.map((campaign: Record<string, unknown>) => ({
            amount: campaign?.total_amount_raised?.value,
            fundraiser: campaign?.user?.username,
            handicap: Math.floor(parseFloat(campaign?.total_amount_raised?.value) / CONFIG.events.GWYF.handicapValue),
          }))),
        );
      } else {
        return await Promise.reject(new Error('Response failed'));
      }
    });
};

export const sortByFundraiser = (a: TiltifyGolfHandicap, b: TiltifyGolfHandicap): number => {
  const aVal = a?.fundraiser.toLocaleLowerCase();
  const bVal = b?.fundraiser.toLocaleLowerCase();

  if (aVal < bVal) {
    return -1;
  }

  if (aVal > bVal) {
    return 1;
  }

  return 0
};
