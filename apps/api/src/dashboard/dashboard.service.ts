import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class DashboardService {
  async getGeneralStats() {
    const db = InMemoryDatabase.getInstance();
    
    const totalEmployees = db.getTotalEmployees();
    const pendingLeaves = db.getPendingLeavesCount();
    const pendingAdvances = db.getPendingAdvancesCount();
    const activeAssets = db.getActiveAssetsCount();

    return {
      totalEmployees,
      activeContracts: totalEmployees,
      pendingLeaves,
      pendingAdvances,
      activeAssets,
    };
  }

  async getEmployeesStats() {
    const db = InMemoryDatabase.getInstance();
    const employees = db.getAllEmployees();

    return {
      total: employees.length,
      byContractType: { UNLIMITED: employees.length },
    };
  }

  async getLeavesStats(year?: number) {
    const db = InMemoryDatabase.getInstance();
    const currentYear = year || new Date().getFullYear();
    const leaves = db.getAllLeaves();

    const yearLeaves = leaves.filter(l => {
      const leaveYear = new Date(l.startDate).getFullYear();
      return leaveYear === currentYear;
    });

    const byStatus = yearLeaves.reduce((acc, leave) => {
      acc[leave.status] = (acc[leave.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDays = yearLeaves
      .filter(l => l.status === 'APPROVED')
      .reduce((sum, l) => sum + l.daysCount, 0);

    return {
      total: yearLeaves.length,
      byType: { ANNUAL: yearLeaves.length },
      byStatus,
      totalDaysApproved: totalDays,
    };
  }

  async getAdvancesStats() {
    const db = InMemoryDatabase.getInstance();
    const advances = db.getAllAdvances();

    const byStatus = advances.reduce((acc, adv) => {
      acc[adv.status] = (acc[adv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = advances
      .filter(a => a.status === 'APPROVED')
      .reduce((sum, a) => sum + a.amount, 0);

    return {
      total: advances.length,
      byStatus,
      totalAmountApproved: totalAmount,
    };
  }

  async getExpiringDocuments() {
    return {
      total: 0,
      byType: {},
      documents: [],
    };
  }

  async getMonthlyAttendance(month: number, year: number) {
    return {
      month,
      year,
      totalDays: 0,
      byEmployee: {},
    };
  }
}
