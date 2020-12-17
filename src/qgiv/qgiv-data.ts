// TODO: rename qgiv.config.ts

export enum Endpoint {
    EVENT_LIST = '/events/list',
    PLEDGE_LIST = '/pledges/list',
    TRANSACTION_LIST = '/reporting/transactions/last/200',
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

