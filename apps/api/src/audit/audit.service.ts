import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async log(
    userId: number,
    action: string,
    entityType: string,
    entityId: number,
    before?: any,
    after?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    console.log(`Audit Log: User ${userId} ${action} ${entityType} ${entityId}`);
    return { success: true };
  }

  async getAuditTrail(entityType: string, entityId: number) {
    return [];
  }

  async getUserActivity(userId: number, limit: number = 50) {
    return [];
  }
}
