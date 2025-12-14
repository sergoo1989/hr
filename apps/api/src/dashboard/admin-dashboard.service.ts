import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class AdminDashboardService {
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
    const db = InMemoryDatabase.getInstance();

    const employees = db.findAllEmployees();
    const totalEmployees = employees.length;
    const pendingLeaves = db.getPendingLeavesCount();
    const pendingAdvances = db.getPendingAdvancesCount();
    
    // حساب الوثائق القريبة من الانتهاء
    const expiringDocuments = this.getExpiringDocumentsCount(employees);
    
    // حساب كشف الرواتب الشهري (مع البدلات الافتراضية حسب قانون العمل السعودي)
    const monthlyPayroll = employees.reduce((sum, emp) => {
      const basicSalary = emp.basicSalary || 0;
      const housing = emp.housingAllowance || (basicSalary * 0.25);
      const transport = emp.transportAllowance || (basicSalary * 0.10);
      return sum + basicSalary + housing + transport;
    }, 0);
    
    // إحصائيات الموظفين
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
  
  private getExpiringDocumentsCount(employees: any[]): number {
    const today = new Date();
    const warningDays = 90;
    let count = 0;
    
    employees.forEach(emp => {
      if (emp.nationality === 'NON_SAUDI') {
        // فحص تاريخ انتهاء الجواز
        if (emp.passportExpiryDate) {
          const days = this.getDaysDifference(today, new Date(emp.passportExpiryDate));
          if (days <= warningDays && days >= 0) count++;
        }
        
        // فحص تاريخ انتهاء رخصة العمل
        if (emp.workPermitExpiryDate) {
          const days = this.getDaysDifference(today, new Date(emp.workPermitExpiryDate));
          if (days <= warningDays && days >= 0) count++;
        }
        
        // فحص تاريخ انتهاء التأمين الطبي
        if (emp.medicalInsuranceExpiryDate) {
          const days = this.getDaysDifference(today, new Date(emp.medicalInsuranceExpiryDate));
          if (days <= warningDays && days >= 0) count++;
        }
        
        // فحص تاريخ انتهاء العقد
        if (emp.contractEndDate) {
          const days = this.getDaysDifference(today, new Date(emp.contractEndDate));
          if (days <= warningDays && days >= 0) count++;
        }
      }
    });
    
    return count;
  }
  
  private getDaysDifference(date1: Date, date2: Date): number {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  }

  async getChartData() {
    const db = InMemoryDatabase.getInstance();
    const employees = db.findAllEmployees();
    const leaves = db.getLeaves();
    
    // توزيع الموظفين حسب القسم
    const departmentDistribution = this.groupByDepartment(employees);
    
    // توزيع الموظفين حسب الجنسية
    const nationalityDistribution = [
      { name: 'سعودي', value: employees.filter(e => e.nationality === 'SAUDI').length },
      { name: 'غير سعودي', value: employees.filter(e => e.nationality === 'NON_SAUDI').length }
    ];
    
    // توزيع الإجازات حسب النوع
    const leaveDistribution = this.groupLeavesByType(leaves);
    
    // توزيع الرواتب
    const salaryDistribution = this.groupSalaryRanges(employees);

    return {
      departmentDistribution,
      nationalityDistribution,
      leaveDistribution,
      salaryDistribution
    };
  }
  
  private groupByDepartment(employees: any[]) {
    const groups = {};
    employees.forEach(emp => {
      const dept = emp.department || 'غير محدد';
      groups[dept] = (groups[dept] || 0) + 1;
    });
    return Object.keys(groups).map(key => ({ name: key, value: groups[key] }));
  }
  
  private groupLeavesByType(leaves: any[]) {
    const groups = {};
    leaves.forEach(leave => {
      const type = leave.leaveType || leave.type || 'غير محدد';
      groups[type] = (groups[type] || 0) + 1;
    });
    return Object.keys(groups).map(key => ({ name: key, value: groups[key] }));
  }
  
  private groupSalaryRanges(employees: any[]) {
    const ranges = {
      '0-5000': 0,
      '5001-10000': 0,
      '10001-15000': 0,
      '15001-20000': 0,
      '20000+': 0
    };
    
    employees.forEach(emp => {
      const salary = emp.basicSalary || 0;
      if (salary <= 5000) ranges['0-5000']++;
      else if (salary <= 10000) ranges['5001-10000']++;
      else if (salary <= 15000) ranges['10001-15000']++;
      else if (salary <= 20000) ranges['15001-20000']++;
      else ranges['20000+']++;
    });
    
    return Object.keys(ranges).map(key => ({ name: key, value: ranges[key] }));
  }

  async getQuickTables() {
    const db = InMemoryDatabase.getInstance();
    
    const leaves = db.getLeaves();
    const advances = db.getAdvances();
    const employees = db.findAllEmployees();
    
    const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
    const pendingAdvances = advances.filter(a => a.status === 'PENDING');
    
    // الموظفين مع وثائق قاربت على الانتهاء
    const expiringDocs = this.getExpiringDocumentsList(employees);
    
    // أحدث التعيينات (آخر 30 يوم)
    const recentHires = this.getRecentHires(employees);

    return {
      pendingLeaves: pendingLeaves.slice(0, 5),
      expiringDocuments: expiringDocs.slice(0, 10),
      recentHires: recentHires.slice(0, 5),
      pendingAdvances: pendingAdvances.slice(0, 5)
    };
  }
  
  private getExpiringDocumentsList(employees: any[]) {
    const today = new Date();
    const warningDays = 90;
    const result = [];
    
    employees.forEach(emp => {
      if (emp.nationality === 'NON_SAUDI') {
        // فحص الجواز
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
        
        // فحص رخصة العمل
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
        
        // فحص التأمين الطبي
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
        
        // فحص العقد
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
  
  private getRecentHires(employees: any[]) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return employees
      .filter(emp => emp.hireDate && new Date(emp.hireDate) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
  }
  
  async getAnalytics() {
    const db = InMemoryDatabase.getInstance();
    const employees = db.findAllEmployees();
    const leaves = db.getLeaves();
    
    // رصيد الإجازات لكل موظف
    const leaveBalances = this.calculateLeaveBalances(employees, leaves);
    
    // الموظفين المستحقين لنهاية الخدمة
    const endOfServiceEligible = this.calculateEndOfService(employees);
    
    // الموظفين المستحقين للتذاكر
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
  
  private calculateLeaveBalances(employees: any[], leaves: any[]) {
    return employees.map(emp => {
      const hireDate = emp.hireDate ? new Date(emp.hireDate) : new Date();
      const today = new Date();
      const yearsWorked = (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      
      // حساب الأيام المستحقة (21 يوم لأول 5 سنوات، 30 يوم بعد ذلك)
      const annualLeaveDays = emp.contractLeaveDays || (yearsWorked >= 5 ? 30 : 21);
      
      // حساب الأيام المستخدمة
      const empLeaves = leaves.filter(l => l.employeeId === emp.id && l.status === 'APPROVED');
      const usedDays = empLeaves.reduce((sum, l) => sum + (l.daysCount || l.days || 0), 0);
      
      const remainingDays = annualLeaveDays - usedDays;
      
      // حساب الأجر الفعلي (الأساسي + البدلات) حسب قانون العمل السعودي المادة 111
      const basicSalary = emp.basicSalary || 0;
      const housingAllowance = emp.housingAllowance || (basicSalary * 0.25);
      const transportAllowance = emp.transportAllowance || (basicSalary * 0.10);
      const actualWage = basicSalary + housingAllowance + transportAllowance;
      
      const dailyRate = actualWage / 30;
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
  
  private calculateEndOfService(employees: any[]) {
    const today = new Date();
    
    return employees.map(emp => {
      const hireDate = emp.hireDate ? new Date(emp.hireDate) : today;
      const yearsWorked = (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const monthsWorked = yearsWorked * 12;
      
      // حساب مكافأة نهاية الخدمة حسب نظام العمل السعودي
      // يجب استخدام الأجر الفعلي (الأساسي + البدلات) حسب المادة 84
      const basicSalary = emp.basicSalary || 0;
      const housingAllowance = emp.housingAllowance || (basicSalary * 0.25);
      const transportAllowance = emp.transportAllowance || (basicSalary * 0.10);
      const actualWage = basicSalary + housingAllowance + transportAllowance;
      
      let endOfServiceAmount = 0;
      const monthlySalary = actualWage;
      
      if (yearsWorked >= 10) {
        // كامل الراتب عن كل سنة
        endOfServiceAmount = yearsWorked * monthlySalary;
      } else if (yearsWorked >= 5) {
        // نصف راتب لأول 5 سنوات + كامل الراتب للباقي
        endOfServiceAmount = (5 * monthlySalary * 0.5) + ((yearsWorked - 5) * monthlySalary);
      } else if (yearsWorked >= 2) {
        // نصف راتب عن كل سنة
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

  async getPayrollReport(startDate: Date, endDate: Date) {
    return { data: [] };
  }

  async getLeaveReport(startDate: Date, endDate: Date) {
    return { data: [] };
  }
}
