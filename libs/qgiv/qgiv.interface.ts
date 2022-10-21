export enum EQgivTransactionStatus {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    VOIDED = 'Voided',
    CHARGEBACK = 'Chargeback',
    RETURNED = 'Returned',
    DECLINED = 'Declined',
    REFUNDED = 'Refunded',
    ERRORS = 'Errors',
    OFFLINE = 'Offline',
    PROMISE = 'Promise',
    MOVED = 'Moved',
}

export interface IQgivTransaction {
    id: string;
    transStatus: string;
    companyDonation: string;
    title: string;
    firstName: string;
    lastName: string;
    employer: string;
    employerEmail: string;
    phone: string;
    fee: string;
    netAmount: string;
    creatingTransactionFor: string;
    billingName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingCountry: string;
    lastFour: string;
    associatedInfo: string;
    donationSource: string;
    sourceID: string;
    optedIn: string;
    filter: string;
    giftAssist: null;
    type: string;
    isRecurring: string;
    paymentType: string;
    paymentMethod: null;
    registrations: [{
        id: string;
        category: string;
        categoryFee: string;
        registrationTotal: string;
    }];
    donations?: [{
        id: string;
        transactionDate: string;
        donationAmount: string;
    }];
    refunds?: [{
        id: string;
        settleDate: string;
        transactionDate: string;
        value: string;
    }];
    contactCompany: string;
    contactAddress: string;
    contactCity: string;
    contactState: string;
    contactZip: string;
    contactCountry: string;
    contactEmail: string;
    formId: string;
    value: string;
    transactionDate: string;
    transactionWasAnonymous: string;
    transactionMemo: string;
    form: {
        id: string;
        name: string;
    };
}

export interface IQgivDonation {
    id:          string;
    status:      string; // TODO?: enum
    displayName: string;
    anonymous:   boolean;
    memo:        string;
    location:    string;
    amount:      number;
    timestamp:   string;
}
