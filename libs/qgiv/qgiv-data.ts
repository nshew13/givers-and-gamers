import { Dict } from 'libs/utilities/structures.interface';

export enum Endpoint {
    EVENT_LIST = '/events/list',
    PLEDGE_LIST = '/pledges/list',
    TRANSACTION_LIST = '/reporting/transactions/last/{numRecords}',
    TRANSACTION_AFTER = '/reporting/transactions/after/{transactionID}',
}

export enum Method {
    GET  = 'GET',
    POST = 'POST',
}


// Use the Endpoint enum KEYS as keys in the EndpointMethod type.
// This looks nicer in the code, but using the enum keys directly
// elsewhere is more difficult.
// export type EndpointMethod = { [key in keyof typeof Endpoint]?: Method };
// or
// export type EndpointMethod = Partial<Record<keyof typeof Endpoint, Method>>;
// export const EndpointMethods: EndpointMethod = {
//     PLEDGE_LIST: Method.GET,
// };

// ALTERNATIVELY:

// Use the Endpoint enum VALUES as keys in the EndpointMethod type.
export type EndpointMethod = { [key in Endpoint]: Method };
export const EndpointMethods: EndpointMethod = {
    [Endpoint.EVENT_LIST]:  Method.GET,
    [Endpoint.PLEDGE_LIST]: Method.GET,
    [Endpoint.TRANSACTION_LIST]: Method.GET,
    [Endpoint.TRANSACTION_AFTER]: Method.GET,
};

/**
 * abbreviate states coming from donation form
 *
 * let rv = {};
 * jQuery('select#state > option').each((index, element) => {
 *      let el = $(element);
 *      rv[el.attr('value')] = el.attr('data-state-code');
 * });
 * console.log(rv);
 */
export const STATES: Dict = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'Armed Forces (AA)': 'AA',
    'Armed Forces (AE)': 'AE',
    'Armed Forces (AP)': 'AP',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam ': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico ': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'United States Minor Outlying Islands': 'UM',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands, U.S.': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}
