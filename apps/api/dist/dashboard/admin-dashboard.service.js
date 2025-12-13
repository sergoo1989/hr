"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let AdminDashboardService = class AdminDashboardService {
    async getAdminDashboard() {
        const [stats, charts, tables, analytics] = await Promise.all([
            this.getQuickStats(),
            this.getChartData(),
            this.getQuickTables(),
            this.getAnalytics()
        ]);
        return {
            stats,
            charts,
            tables,
            analytics
        };
    }
    async getQuickStats() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employees = db.findAllEmployees();
        const totalEmployees = employees.length;
        const pendingLeaves = db.getPendingLeavesCount();
        const pendingAdvances = db.getPendingAdvancesCount();
        const expiringDocuments = this.getExpiringDocumentsCount(employees);
        const monthlyPayroll = employees.reduce((sum, emp) => {
            const basicSalary = emp.basicSalary || 0;
            const housing = emp.housingAllowance || 0;
            const transport = emp.transportAllowance || 0;
            return sum + basicSalary + housing + transport;
        }, 0);
        const saudiCount = employees.filter(e => e.nationality === 'SAUDI').length;
        const nonSaudiCount = employees.filter(e => e.nationality === 'NON_SAUDI').length;
        const remoteCount = employees.filter(e => e.workType === 'REMOTE').length;
        const partTimeCount = employees.filter(e => e.workType === 'PART_TIME').length;
        const personalSponsorCount = employees.filter(e => e.sponsorshipType === 'PERSONAL').length;
        return {
            totalEmployees,
            activeEmployees: totalEmployees,
            pendingLeaves,
            expiringDocuments,
            monthlyPayroll: Math.round(monthlyPayroll),
            pendingAdvances,
            saudiCount,
            nonSaudiCount,
            remoteCount,
            partTimeCount,
            personalSponsorCount
        };
    }
    getExpiringDocumentsCount(employees) {
        const today = new Date();
        const warningDays = 90;
        let count = 0;
        employees.forEach(emp => {
            if (emp.nationality === 'NON_SAUDI') {
                if (emp.passportExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.passportExpiryDate));
                    if (days <= warningDays && days >= 0)
                        count++;
                }
                if (emp.workPermitExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.workPermitExpiryDate));
                    if (days <= warningDays && days >= 0)
                        count++;
                }
                if (emp.medicalInsuranceExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.medicalInsuranceExpiryDate));
                    if (days <= warningDays && days >= 0)
                        count++;
                }
                if (emp.contractEndDate) {
                    const days = this.getDaysDifference(today, new Date(emp.contractEndDate));
                    if (days <= warningDays && days >= 0)
                        count++;
                }
            }
        });
        return count;
    }
    getDaysDifference(date1, date2) {
        return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    }
    async getChartData() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employees = db.findAllEmployees();
        const leaves = db.getLeaves();
        const departmentDistribution = this.groupByDepartment(employees);
        const nationalityDistribution = [
            { name: 'سعودي', value: employees.filter(e => e.nationality === 'SAUDI').length },
            { name: 'غير سعودي', value: employees.filter(e => e.nationality === 'NON_SAUDI').length }
        ];
        const leaveDistribution = this.groupLeavesByType(leaves);
        const salaryDistribution = this.groupSalaryRanges(employees);
        return {
            departmentDistribution,
            nationalityDistribution,
            leaveDistribution,
            salaryDistribution
        };
    }
    groupByDepartment(employees) {
        const groups = {};
        employees.forEach(emp => {
            const dept = emp.department || 'غير محدد';
            groups[dept] = (groups[dept] || 0) + 1;
        });
        return Object.keys(groups).map(key => ({ name: key, value: groups[key] }));
    }
    groupLeavesByType(leaves) {
        const groups = {};
        leaves.forEach(leave => {
            const type = leave.leaveType || leave.type || 'غير محدد';
            groups[type] = (groups[type] || 0) + 1;
        });
        return Object.keys(groups).map(key => ({ name: key, value: groups[key] }));
    }
    groupSalaryRanges(employees) {
        const ranges = {
            '0-5000': 0,
            '5001-10000': 0,
            '10001-15000': 0,
            '15001-20000': 0,
            '20000+': 0
        };
        employees.forEach(emp => {
            const salary = emp.basicSalary || 0;
            if (salary <= 5000)
                ranges['0-5000']++;
            else if (salary <= 10000)
                ranges['5001-10000']++;
            else if (salary <= 15000)
                ranges['10001-15000']++;
            else if (salary <= 20000)
                ranges['15001-20000']++;
            else
                ranges['20000+']++;
        });
        return Object.keys(ranges).map(key => ({ name: key, value: ranges[key] }));
    }
    async getQuickTables() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const leaves = db.getLeaves();
        const advances = db.getAdvances();
        const employees = db.findAllEmployees();
        const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
        const pendingAdvances = advances.filter(a => a.status === 'PENDING');
        const expiringDocs = this.getExpiringDocumentsList(employees);
        const recentHires = this.getRecentHires(employees);
        return {
            pendingLeaves: pendingLeaves.slice(0, 5),
            expiringDocuments: expiringDocs.slice(0, 10),
            recentHires: recentHires.slice(0, 5),
            pendingAdvances: pendingAdvances.slice(0, 5)
        };
    }
    getExpiringDocumentsList(employees) {
        const today = new Date();
        const warningDays = 90;
        const result = [];
        employees.forEach(emp => {
            if (emp.nationality === 'NON_SAUDI') {
                if (emp.passportExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.passportExpiryDate));
                    if (days <= warningDays && days >= 0) {
                        result.push({
                            employeeId: emp.id,
                            employeeName: emp.fullName,
                            employeeNumber: emp.employeeNumber,
                            documentType: 'جواز السفر',
                            expiryDate: emp.passportExpiryDate,
                            daysRemaining: days
                        });
                    }
                }
                if (emp.workPermitExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.workPermitExpiryDate));
                    if (days <= warningDays && days >= 0) {
                        result.push({
                            employeeId: emp.id,
                            employeeName: emp.fullName,
                            employeeNumber: emp.employeeNumber,
                            documentType: 'رخصة العمل',
                            expiryDate: emp.workPermitExpiryDate,
                            daysRemaining: days
                        });
                    }
                }
                if (emp.medicalInsuranceExpiryDate) {
                    const days = this.getDaysDifference(today, new Date(emp.medicalInsuranceExpiryDate));
                    if (days <= warningDays && days >= 0) {
                        result.push({
                            employeeId: emp.id,
                            employeeName: emp.fullName,
                            employeeNumber: emp.employeeNumber,
                            documentType: 'التأمين الطبي',
                            expiryDate: emp.medicalInsuranceExpiryDate,
                            daysRemaining: days
                        });
                    }
                }
                if (emp.contractEndDate) {
                    const days = this.getDaysDifference(today, new Date(emp.contractEndDate));
                    if (days <= warningDays && days >= 0) {
                        result.push({
                            employeeId: emp.id,
                            employeeName: emp.fullName,
                            employeeNumber: emp.employeeNumber,
                            documentType: 'العقد',
                            expiryDate: emp.contractEndDate,
                            daysRemaining: days
                        });
                    }
                }
            }
        });
        return result.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
    getRecentHires(employees) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return employees
            .filter(emp => emp.hireDate && new Date(emp.hireDate) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
    }
    async getAnalytics() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employees = db.findAllEmployees();
        const leaves = db.getLeaves();
        const leaveBalances = this.calculateLeaveBalances(employees, leaves);
        const endOfServiceEligible = this.calculateEndOfService(employees);
        const ticketEligible = employees.filter(emp => emp.ticketEntitlement === true);
        return {
            leaveBalances,
            endOfServiceEligible,
            ticketEligible: ticketEligible.map(emp => ({
                id: emp.id,
                fullName: emp.fullName,
                employeeNumber: emp.employeeNumber,
                ticketClass: emp.ticketClass || 'ECONOMY',
                estimatedCost: emp.ticketClass === 'BUSINESS' ? 5000 : 2000
            }))
        };
    }
    calculateLeaveBalances(employees, leaves) {
        return employees.map(emp => {
            const hireDate = emp.hireDate ? new Date(emp.hireDate) : new Date();
            const today = new Date();
            const yearsWorked = (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
            const annualLeaveDays = emp.contractLeaveDays || (yearsWorked >= 5 ? 30 : 21);
            const empLeaves = leaves.filter(l => l.employeeId === emp.id && l.status === 'APPROVED');
            const usedDays = empLeaves.reduce((sum, l) => sum + (l.daysCount || l.days || 0), 0);
            const remainingDays = annualLeaveDays - usedDays;
            const dailyRate = (emp.basicSalary || 0) / 30;
            const leaveBalanceAmount = remainingDays * dailyRate;
            return {
                employeeId: emp.id,
                fullName: emp.fullName,
                employeeNumber: emp.employeeNumber,
                annualLeaveDays,
                usedDays,
                remainingDays,
                dailyRate: Math.round(dailyRate),
                leaveBalanceAmount: Math.round(leaveBalanceAmount)
            };
        });
    }
    calculateEndOfService(employees) {
        const today = new Date();
        return employees.map(emp => {
            const hireDate = emp.hireDate ? new Date(emp.hireDate) : today;
            const yearsWorked = (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
            const monthsWorked = yearsWorked * 12;
            let endOfServiceAmount = 0;
            const monthlySalary = emp.basicSalary || 0;
            if (yearsWorked >= 10) {
                endOfServiceAmount = yearsWorked * monthlySalary;
            }
            else if (yearsWorked >= 5) {
                endOfServiceAmount = (5 * monthlySalary * 0.5) + ((yearsWorked - 5) * monthlySalary);
            }
            else if (yearsWorked >= 2) {
                endOfServiceAmount = yearsWorked * monthlySalary * 0.5;
            }
            return {
                employeeId: emp.id,
                fullName: emp.fullName,
                employeeNumber: emp.employeeNumber,
                hireDate: emp.hireDate,
                yearsWorked: Math.floor(yearsWorked * 10) / 10,
                monthsWorked: Math.floor(monthsWorked),
                monthlySalary,
                endOfServiceAmount: Math.round(endOfServiceAmount),
                eligible: yearsWorked >= 2
            };
        }).filter(emp => emp.eligible);
    }
    async getExpiringDocuments() {
        return [];
    }
    async getPayrollReport(startDate, endDate) {
        return { data: [] };
    }
    async getLeaveReport(startDate, endDate) {
        return { data: [] };
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)()
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map