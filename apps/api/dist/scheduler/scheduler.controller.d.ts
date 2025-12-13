import { DocumentExpiryScheduler } from './document-expiry.scheduler';
export declare class SchedulerController {
    private scheduler;
    constructor(scheduler: DocumentExpiryScheduler);
    manualCheck(): Promise<{
        expiring: any[];
        expired: any[];
    }>;
    getExpiryReport(): Promise<{
        documents: any[];
        total: number;
    }>;
}
