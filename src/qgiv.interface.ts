export interface ITransactionsResponse {
    forms: IForm[];
}

export interface IForm {
    summary: ISummary;
    transactions: ITransaction[];
}

export interface ISummary {
    totalTransactions: number;
    creditCardTransactions: number;
    eCheckTransactons: number;
    offlineTransactions: number;
    totalAmount: string;
    creditCardAmount: string;
    eCheckAmount: string;
    offlineAmount: string;
}

export interface ITransaction {
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
