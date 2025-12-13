export declare class AuditService {
    log(userId: number, action: string, entityType: string, entityId: number, before?: any, after?: any, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
    getAuditTrail(entityType: string, entityId: number): Promise<any[]>;
    getUserActivity(userId: number, limit?: number): Promise<any[]>;
}
