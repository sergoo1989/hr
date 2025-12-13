"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DocumentExpiryScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentExpiryScheduler = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let DocumentExpiryScheduler = DocumentExpiryScheduler_1 = class DocumentExpiryScheduler {
    constructor() {
        this.logger = new common_1.Logger(DocumentExpiryScheduler_1.name);
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
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
};
exports.DocumentExpiryScheduler = DocumentExpiryScheduler;
exports.DocumentExpiryScheduler = DocumentExpiryScheduler = DocumentExpiryScheduler_1 = __decorate([
    (0, common_1.Injectable)()
], DocumentExpiryScheduler);
//# sourceMappingURL=document-expiry.scheduler.js.map