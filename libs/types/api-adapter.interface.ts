import type { Observable } from "rxjs";

export interface ApiAdapter<DonationType> {
    stopPolling: () => void;
    watchTransactions: (pollIntervalMSec: number) => Observable<DonationType>;
}
