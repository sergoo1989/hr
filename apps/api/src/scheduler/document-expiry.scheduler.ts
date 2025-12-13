import { Injectable, Logger } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class DocumentExpiryScheduler {
  private readonly logger = new Logger(DocumentExpiryScheduler.name);
  private db = InMemoryDatabase.getInstance();

  async checkExpiringDocuments() {
    this.logger.log('بدء التحقق من المستندات المنتهية...');
    return { expiring: [], expired: [] };
  }

  async getExpiringDocumentsReport() {
    return { documents: [], total: 0 };
  }

  async manualCheck() {
    return this.checkExpiringDocuments();
  }

  async getExpiryReport() {
    return this.getExpiringDocumentsReport();
  }
}
