export declare class DocumentExpiryScheduler {
    private readonly logger;
    private db;
    checkExpiringDocuments(): Promise<{
        expiring: any[];
        expired: any[];
    }>;
    getExpiringDocumentsReport(): Promise<{
        documents: any[];
        total: number;
    }>;
    manualCheck(): Promise<{
        expiring: any[];
        expired: any[];
    }>;
    getExpiryReport(): Promise<{
        documents: any[];
        total: number;
    }>;
}
