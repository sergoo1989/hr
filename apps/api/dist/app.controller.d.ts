export declare class AppController {
    getWelcome(): {
        message: string;
        version: string;
        status: string;
        endpoints: {
            auth: {
                login: string;
                register: string;
            };
            employee: {
                dashboard: string;
                leaveBalance: string;
                travelTicket: string;
                endOfService: string;
                leaves: string;
                requestLeave: string;
                advances: string;
                requestAdvance: string;
            };
            admin: {
                dashboard: string;
                stats: string;
                charts: string;
                alertsExpiry: string;
                payrollReport: string;
                leaveReport: string;
                pendingLeaves: string;
                approveLeave: string;
                rejectLeave: string;
            };
            scheduler: {
                checkDocuments: string;
                expiryReport: string;
            };
        };
        documentation: {
            api: string;
            readme: string;
        };
        quickStart: {
            '1': string;
            '2': string;
            '3': string;
        };
    };
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        message: string;
    };
}
