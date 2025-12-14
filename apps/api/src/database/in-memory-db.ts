// قاعدة بيانات في الذاكرة - In-Memory Database
import * as bcrypt from 'bcrypt';
import { DataStorage } from './data-storage';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employeeId?: number;
  isActive: boolean; // حساب مفعل أم لا
  mustChangePassword: boolean; // يجب تغيير كلمة المرور
  activationToken?: string; // رمز التفعيل
  email?: string; // البريد الإلكتروني للإشعارات
}

export interface Employee {
  id: number;
  fullName: string;
  employeeNumber: string;
  nationalId: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  department?: string;
  jobTitle?: string;
  hireDate?: Date;
  salary?: number;
  basicSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
  nationality?: string;
  // Work type fields
  workType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT';
  sponsorshipType?: 'COMPANY' | 'PERSONAL' | 'EXTERNAL'; // كفالة الشركة أو شخصية أو عمالة خارجية
  ticketEntitlement?: boolean; // استحقاق التذكرة
  ticketClass?: 'ECONOMY' | 'BUSINESS'; // درجة التذكرة
  // Non-Saudi employee fields
  contractDuration?: number;
  contractLeaveDays?: number;
  passportNumber?: string;
  passportExpiryDate?: Date | string;
  workPermitExpiryDate?: Date | string;
  passportFeesExpiryDate?: Date | string;
  medicalInsuranceExpiryDate?: Date | string;
  contractEndDate?: Date | string;
  // End of service fields
  terminationReason?: 'NORMAL_END' | 'RESIGNATION' | 'TERMINATION'; // سبب انتهاء الخدمة
  terminationDate?: Date | string; // تاريخ انتهاء الخدمة
}

export interface Leave {
  id: number;
  employeeId: number;
  type?: string;
  leaveType?: string;
  startDate: Date | string;
  endDate: Date | string;
  days?: number;
  daysCount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: Date | string;
  reason?: string;
}

export interface Advance {
  id: number;
  employeeId: number;
  amount: number;
  requestDate: Date | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
}

export interface Asset {
  id: number;
  employeeId: number;
  assetType: string;
  description?: string;
  assignedDate: Date | string;
  returned: boolean;
  returnDate?: Date | string;
  confirmed: boolean; // تأكيد الموظف على استلام العهدة
  confirmedDate?: Date | string; // تاريخ تأكيد الاستلام
}

export interface Department {
  id: number;
  name: string;
  createdAt: Date | string;
}

export interface JobTitle {
  id: number;
  title: string;
  createdAt: Date | string;
}

export interface CompanySettings {
  id: number;
  companyName: string;
  companyNameEn?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface Attendance {
  id: number;
  employeeId: number;
  date: Date | string;
  checkIn?: Date | string;
  checkOut?: Date | string;
  workHours?: number;
  lateMinutes?: number;
  overtimeHours?: number;
  earlyLeaveMinutes?: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  notes?: string;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  totalAllowances: number;
  grossSalary: number;
  // الحضور والغياب
  presentDays: number;
  absentDays: number;
  lateDays: number;
  lateDeduction: number;
  absentDeduction: number;
  // الإضافي
  overtimeHours: number;
  overtimeAmount: number;
  // السلف والخصومات
  advanceDeduction: number;
  // التأمينات الاجتماعية
  gosiDeduction: number; // 10% للموظف السعودي
  // الخصومات الأخرى
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  paidDate?: Date | string;
  notes?: string;
  createdAt: Date | string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: Date | string;
  link?: string;
}

export class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  private storage: DataStorage;
  
  public users: User[] = [];
  public employees: Employee[] = [];
  public leaves: Leave[] = [];
  public advances: Advance[] = [];
  public assets: Asset[] = [];
  public departments: Department[] = [];
  public jobTitles: JobTitle[] = [];
  public companySettings: CompanySettings | null = null;
  public attendances: Attendance[] = [];
  public payrollRecords: PayrollRecord[] = [];
  public notifications: Notification[] = [];

  private userIdCounter = 1;
  private employeeIdCounter = 1;
  private leaveIdCounter = 1;
  private advanceIdCounter = 1;
  private assetIdCounter = 1;
  private departmentIdCounter = 1;
  private jobTitleIdCounter = 1;
  private attendanceIdCounter = 1;
  private payrollRecordIdCounter = 1;
  private notificationIdCounter = 1;

  private constructor() {
    this.storage = DataStorage.getInstance();
    this.loadFromStorage();
    this.seedInitialData();
    
    // حفظ تلقائي كل 30 ثانية كنسخة احتياطية
    setInterval(() => {
      this.saveToStorage();
      console.log('🔄 حفظ تلقائي للبيانات - ' + new Date().toLocaleTimeString('ar-SA'));
    }, 30000); // كل 30 ثانية
    
    // حفظ البيانات عند إغلاق التطبيق
    process.on('SIGINT', () => {
      console.log('\n⚠️ جاري إيقاف السيرفر...');
      this.saveToStorage();
      console.log('✅ تم حفظ البيانات بنجاح قبل الإغلاق');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n⚠️ جاري إيقاف السيرفر...');
      this.saveToStorage();
      console.log('✅ تم حفظ البيانات بنجاح قبل الإغلاق');
      process.exit(0);
    });
  }

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }
  
  // تحميل البيانات من التخزين الدائم
  private loadFromStorage(): void {
    const data = this.storage.loadData();
    if (data) {
      this.users = data.users || [];
      this.employees = data.employees || [];
      this.leaves = data.leaves || [];
      this.advances = data.advances || [];
      this.assets = data.assets || [];
      this.departments = data.departments || [];
      this.jobTitles = data.jobTitles || [];
      this.companySettings = data.companySettings || null;
      this.attendances = data.attendances || [];
      this.payrollRecords = data.payrollRecords || [];
      this.notifications = data.notifications || [];
      
      // استعادة الـ Counters
      this.userIdCounter = data.userIdCounter || 1;
      this.employeeIdCounter = data.employeeIdCounter || 1;
      this.leaveIdCounter = data.leaveIdCounter || 1;
      this.advanceIdCounter = data.advanceIdCounter || 1;
      this.assetIdCounter = data.assetIdCounter || 1;
      this.departmentIdCounter = data.departmentIdCounter || 1;
      this.jobTitleIdCounter = data.jobTitleIdCounter || 1;
      this.attendanceIdCounter = data.attendanceIdCounter || 1;
      this.payrollRecordIdCounter = data.payrollRecordIdCounter || 1;
      this.notificationIdCounter = data.notificationIdCounter || 1;
      
      console.log('✅ تم تحميل البيانات المحفوظة');
    }
  }
  
  // حفظ البيانات إلى التخزين الدائم
  public saveToStorage(): void {
    const data = {
      users: this.users,
      employees: this.employees,
      leaves: this.leaves,
      advances: this.advances,
      assets: this.assets,
      departments: this.departments,
      jobTitles: this.jobTitles,
      companySettings: this.companySettings,
      attendances: this.attendances,
      payrollRecords: this.payrollRecords,
      notifications: this.notifications,
      userIdCounter: this.userIdCounter,
      employeeIdCounter: this.employeeIdCounter,
      leaveIdCounter: this.leaveIdCounter,
      advanceIdCounter: this.advanceIdCounter,
      assetIdCounter: this.assetIdCounter,
      departmentIdCounter: this.departmentIdCounter,
      jobTitleIdCounter: this.jobTitleIdCounter,
      attendanceIdCounter: this.attendanceIdCounter,
      payrollRecordIdCounter: this.payrollRecordIdCounter,
      notificationIdCounter: this.notificationIdCounter,
    };
    this.storage.saveData(data);
  }

  // الحصول على جميع البيانات
  public getAllData() {
    return {
      users: this.users,
      employees: this.employees,
      leaves: this.leaves,
      advances: this.advances,
      assets: this.assets,
      departments: this.departments,
      jobTitles: this.jobTitles,
      companySettings: this.companySettings,
      attendances: this.attendances,
      payrollRecords: this.payrollRecords,
      notifications: this.notifications,
      counters: {
        userIdCounter: this.userIdCounter,
        employeeIdCounter: this.employeeIdCounter,
        leaveIdCounter: this.leaveIdCounter,
        advanceIdCounter: this.advanceIdCounter,
        assetIdCounter: this.assetIdCounter,
        departmentIdCounter: this.departmentIdCounter,
        jobTitleIdCounter: this.jobTitleIdCounter,
        attendanceIdCounter: this.attendanceIdCounter,
        payrollRecordIdCounter: this.payrollRecordIdCounter,
        notificationIdCounter: this.notificationIdCounter,
      }
    };
  }

  // استعادة البيانات من نسخة احتياطية
  public loadFromBackup(backupData: any) {
    try {
      this.users = backupData.users || [];
      this.employees = backupData.employees || [];
      this.leaves = backupData.leaves || [];
      this.advances = backupData.advances || [];
      this.assets = backupData.assets || [];
      this.departments = backupData.departments || [];
      this.jobTitles = backupData.jobTitles || [];
      this.companySettings = backupData.companySettings || this.companySettings;
      this.attendances = backupData.attendances || [];
      this.payrollRecords = backupData.payrollRecords || [];
      this.notifications = backupData.notifications || [];
      
      // استعادة العدادات
      if (backupData.counters) {
        this.userIdCounter = backupData.counters.userIdCounter || this.userIdCounter;
        this.employeeIdCounter = backupData.counters.employeeIdCounter || this.employeeIdCounter;
        this.leaveIdCounter = backupData.counters.leaveIdCounter || this.leaveIdCounter;
        this.advanceIdCounter = backupData.counters.advanceIdCounter || this.advanceIdCounter;
        this.assetIdCounter = backupData.counters.assetIdCounter || this.assetIdCounter;
        this.departmentIdCounter = backupData.counters.departmentIdCounter || this.departmentIdCounter;
        this.jobTitleIdCounter = backupData.counters.jobTitleIdCounter || this.jobTitleIdCounter;
        this.attendanceIdCounter = backupData.counters.attendanceIdCounter || this.attendanceIdCounter;
        this.payrollRecordIdCounter = backupData.counters.payrollRecordIdCounter || this.payrollRecordIdCounter;
        this.notificationIdCounter = backupData.counters.notificationIdCounter || this.notificationIdCounter;
      } else {
        // للتوافق مع النسخ القديمة
        this.userIdCounter = backupData.userIdCounter || this.userIdCounter;
        this.employeeIdCounter = backupData.employeeIdCounter || this.employeeIdCounter;
        this.leaveIdCounter = backupData.leaveIdCounter || this.leaveIdCounter;
        this.advanceIdCounter = backupData.advanceIdCounter || this.advanceIdCounter;
        this.assetIdCounter = backupData.assetIdCounter || this.assetIdCounter;
        this.departmentIdCounter = backupData.departmentIdCounter || this.departmentIdCounter;
        this.jobTitleIdCounter = backupData.jobTitleIdCounter || this.jobTitleIdCounter;
        this.attendanceIdCounter = backupData.attendanceIdCounter || this.attendanceIdCounter;
        this.payrollRecordIdCounter = backupData.payrollRecordIdCounter || this.payrollRecordIdCounter;
        this.notificationIdCounter = backupData.notificationIdCounter || this.notificationIdCounter;
      }

      console.log('✅ تم استعادة البيانات بنجاح');
      return { success: true };
    } catch (error) {
      console.error('❌ فشل في استعادة البيانات:', error);
      throw error;
    }
  }

  async seedInitialData() {
    // إذا كانت البيانات محملة من الملف، لا نحتاج لتهيئة بيانات جديدة
    if (this.storage.hasData() && this.employees.length > 0) {
      console.log('✅ البيانات المحفوظة جاهزة للاستخدام');
      return;
    }
    
    console.log('🌱 تحميل البيانات الافتراضية...');

    // إنشاء موظف مدير النظام
    const adminEmployee: Employee = {
      id: this.employeeIdCounter++,
      fullName: 'مدير النظام',
      employeeNumber: 'EMP001',
      nationalId: '1234567890',
      email: 'admin@company.com',
      phone: '+966501234567',
      department: 'الإدارة',
      jobTitle: 'مدير الموارد البشرية',
      hireDate: new Date('2020-01-01'),
      basicSalary: 10000,
      housingAllowance: 3000,
      transportAllowance: 1000,
      nationality: 'SAUDI',
    };
    this.employees.push(adminEmployee);

    // إنشاء موظف عادي
    const employee: Employee = {
      id: this.employeeIdCounter++,
      fullName: 'أحمد محمد السعيد',
      employeeNumber: 'EMP002',
      nationalId: '1234567891',
      email: 'ahmed@company.com',
      phone: '+966501234568',
      department: 'تقنية المعلومات',
      jobTitle: 'مطور برامج',
      hireDate: new Date('2021-06-15'),
      basicSalary: 8000,
      housingAllowance: 2500,
      transportAllowance: 800,
      nationality: 'SAUDI',
    };
    this.employees.push(employee);

    // إنشاء مستخدمين
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      id: this.userIdCounter++,
      username: 'admin',
      password: adminPasswordHash,
      role: 'ADMIN',
      employeeId: adminEmployee.id,
      isActive: true,
      mustChangePassword: false,
      email: 'admin@hr-system.com',
    };
    this.users.push(adminUser);

    const empPasswordHash = await bcrypt.hash('emp123', 10);
    const empUser: User = {
      id: this.userIdCounter++,
      username: 'employee1',
      password: empPasswordHash,
      role: 'EMPLOYEE',
      employeeId: employee.id,
      isActive: true,
      mustChangePassword: false,
      email: 'employee1@hr-system.com',
    };
    this.users.push(empUser);

    // إضافة نماذج إجازات للاختبار
    const leave1: Leave = {
      id: this.leaveIdCounter++,
      employeeId: employee.id,
      type: 'ANNUAL',
      leaveType: 'إجازة سنوية',
      startDate: new Date('2024-12-20').toISOString(),
      endDate: new Date('2024-12-25').toISOString(),
      days: 5,
      daysCount: 5,
      status: 'PENDING',
      requestDate: new Date('2024-12-10').toISOString(),
      reason: 'عطلة نهاية العام',
    };
    this.leaves.push(leave1);

    const leave2: Leave = {
      id: this.leaveIdCounter++,
      employeeId: employee.id,
      type: 'SICK',
      leaveType: 'إجازة مرضية',
      startDate: new Date('2024-11-15').toISOString(),
      endDate: new Date('2024-11-17').toISOString(),
      days: 2,
      daysCount: 2,
      status: 'APPROVED',
      requestDate: new Date('2024-11-14').toISOString(),
      reason: 'مرض',
    };
    this.leaves.push(leave2);

    // إضافة نماذج سلف للاختبار
    const advance1: Advance = {
      id: this.advanceIdCounter++,
      employeeId: employee.id,
      amount: 5000,
      requestDate: new Date('2024-12-01').toISOString(),
      status: 'PENDING',
      reason: 'احتياجات شخصية',
    };
    this.advances.push(advance1);

    const advance2: Advance = {
      id: this.advanceIdCounter++,
      employeeId: employee.id,
      amount: 3000,
      requestDate: new Date('2024-11-10').toISOString(),
      status: 'APPROVED',
      reason: 'ظروف طارئة',
    };
    this.advances.push(advance2);

    // إضافة أصول للموظف
    const asset1: Asset = {
      id: this.assetIdCounter++,
      employeeId: employee.id,
      assetType: 'LAPTOP',
      description: 'Dell Latitude 5520',
      assignedDate: new Date('2021-06-15').toISOString(),
      returned: false,
      confirmed: true,
      confirmedDate: new Date('2021-06-15').toISOString(),
    };
    this.assets.push(asset1);

    // إعدادات الشركة
    this.companySettings = {
      id: 1,
      companyName: 'شركة الموارد البشرية',
      companyNameEn: 'HR Company',
      email: 'info@hrcompany.com',
      phone: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      taxNumber: '300000000000003',
    };

    // الأقسام الافتراضية
    const departments = [
      'الإدارة',
      'تقنية المعلومات',
      'الموارد البشرية',
      'المالية',
      'التسويق',
      'المبيعات',
    ];

    departments.forEach(dept => {
      this.departments.push({
        id: this.departmentIdCounter++,
        name: dept,
        createdAt: new Date().toISOString(),
      });
    });

    // المسميات الوظيفية الافتراضية
    const jobTitles = [
      'مدير الموارد البشرية',
      'مطور برامج',
      'مدير مالي',
      'محاسب',
      'مدير تسويق',
      'مندوب مبيعات',
      'موظف إداري',
    ];

    jobTitles.forEach(title => {
      this.jobTitles.push({
        id: this.jobTitleIdCounter++,
        title: title,
        createdAt: new Date().toISOString(),
      });
    });

    console.log('✅ تم تحميل البيانات الافتراضية');
    console.log('👤 Admin: admin / admin123');
    console.log('👤 Employee: employee1 / emp123');
    console.log('📋 تم إضافة: 2 إجازات، 2 سلف، 1 أصل');
    console.log('🏢 تم إضافة: ' + this.departments.length + ' أقسام، ' + this.jobTitles.length + ' مسميات وظيفية');
    this.saveToStorage(); // حفظ البيانات الأولية
  }

  // User Methods
  async createUser(
    username: string, 
    password: string, 
    role: 'ADMIN' | 'EMPLOYEE', 
    employeeId?: number,
    email?: string,
    isActive: boolean = true,
    mustChangePassword: boolean = false
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = this.generateActivationToken();
    
    const user: User = {
      id: this.userIdCounter++,
      username,
      password: hashedPassword,
      role,
      employeeId,
      email,
      isActive,
      mustChangePassword,
      activationToken,
    };
    this.users.push(user);
    this.saveToStorage(); // حفظ البيانات
    return user;
  }

  findUserByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  findAllUsers(): User[] {
    return this.users;
  }

  findUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findUserByEmployeeId(employeeId: number): User | undefined {
    return this.users.find(u => u.employeeId === employeeId);
  }

  findUserByActivationToken(token: string): User | undefined {
    return this.users.find(u => u.activationToken === token);
  }

  updateUserPassword(userId: number, newHashedPassword: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = newHashedPassword;
      user.mustChangePassword = false;
      this.saveToStorage();
    }
  }

  activateUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isActive = true;
      user.activationToken = undefined;
      this.saveToStorage();
    }
  }

  private generateActivationToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Employee Methods
  createEmployee(data: Omit<Employee, 'id'>): Employee {
    // Generate employee number automatically
    const employeeNumber = data.employeeNumber || `EMP${String(this.employeeIdCounter).padStart(3, '0')}`;
    
    const employee: Employee = {
      id: this.employeeIdCounter++,
      ...data,
      employeeNumber,
    };
    this.employees.push(employee);
    this.saveToStorage(); // حفظ البيانات
    return employee;
  }

  findEmployeeById(id: number): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  findAllEmployees(): Employee[] {
    return this.employees;
  }

  updateEmployee(id: number, data: Partial<Employee>): Employee | undefined {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...data };
      this.saveToStorage(); // حفظ البيانات
      return this.employees[index];
    }
    return undefined;
  }

  deleteEmployee(id: number): boolean {
    const index = this.employees.findIndex(e => e.id === id);
    if (index > -1) {
      this.employees.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  deleteUserByEmployeeId(employeeId: number): boolean {
    const index = this.users.findIndex(u => u.employeeId === employeeId);
    if (index > -1) {
      this.users.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  deleteUser(userId: number): boolean {
    const index = this.users.findIndex(u => u.id === userId);
    if (index > -1) {
      this.users.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  // Leave Methods
  createLeave(data: Omit<Leave, 'id'>): Leave {
    const leave: Leave = {
      id: this.leaveIdCounter++,
      ...data,
    };
    this.leaves.push(leave);
    this.saveToStorage(); // حفظ البيانات
    return leave;
  }

  findLeavesByEmployeeId(employeeId: number): Leave[] {
    return this.leaves.filter(l => l.employeeId === employeeId);
  }

  findPendingLeaves(): Leave[] {
    return this.leaves.filter(l => l.status === 'PENDING');
  }

  findAllLeaves(): Leave[] {
    return this.leaves;
  }

  updateLeaveStatus(id: number, status: 'APPROVED' | 'REJECTED'): Leave | undefined {
    const leave = this.leaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      this.saveToStorage(); // حفظ البيانات
      return leave;
    }
    return undefined;
  }

  deleteLeave(id: number): boolean {
    const index = this.leaves.findIndex(l => l.id === id);
    if (index > -1) {
      this.leaves.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  // Advance Methods
  createAdvance(data: Omit<Advance, 'id'>): Advance {
    const advance: Advance = {
      id: this.advanceIdCounter++,
      ...data,
    };
    this.advances.push(advance);
    this.saveToStorage(); // حفظ البيانات
    return advance;
  }

  findAdvancesByEmployeeId(employeeId: number): Advance[] {
    return this.advances.filter(a => a.employeeId === employeeId);
  }

  findPendingAdvances(): Advance[] {
    return this.advances.filter(a => a.status === 'PENDING');
  }

  findAllAdvances(): Advance[] {
    return this.advances;
  }

  updateAdvanceStatus(id: number, status: 'APPROVED' | 'REJECTED'): Advance | undefined {
    const advance = this.advances.find(a => a.id === id);
    if (advance) {
      advance.status = status;
      this.saveToStorage(); // حفظ البيانات
      return advance;
    }
    return undefined;
  }

  deleteAdvance(id: number): boolean {
    const index = this.advances.findIndex(a => a.id === id);
    if (index > -1) {
      this.advances.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  // Asset Methods
  createAsset(data: Omit<Asset, 'id'>): Asset {
    const asset: Asset = {
      id: this.assetIdCounter++,
      ...data,
    };
    this.assets.push(asset);
    this.saveToStorage(); // حفظ البيانات
    return asset;
  }

  findAssetsByEmployeeId(employeeId: number): Asset[] {
    return this.assets.filter(a => a.employeeId === employeeId);
  }

  findAssetById(id: number): Asset | undefined {
    return this.assets.find(a => a.id === id);
  }

  findAllAssets(): Asset[] {
    return this.assets;
  }

  confirmAssetReceipt(assetId: number, employeeId: number): Asset | undefined {
    const asset = this.assets.find(a => a.id === assetId && a.employeeId === employeeId);
    if (asset && !asset.confirmed) {
      asset.confirmed = true;
      asset.confirmedDate = new Date().toISOString();
      this.saveToStorage();
      return asset;
    }
    return undefined;
  }

  deleteAsset(id: number): boolean {
    const index = this.assets.findIndex(a => a.id === id);
    if (index > -1) {
      this.assets.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getLeaves(): Leave[] {
    return this.leaves;
  }

  getAllLeaves(): Leave[] {
    return this.leaves;
  }

  getAdvances(): Advance[] {
    return this.advances;
  }

  getAllAdvances(): Advance[] {
    return this.advances;
  }

  getAllEmployees(): Employee[] {
    return this.employees;
  }

  getActiveAssetsCount(): number {
    return this.assets.filter(a => !a.returned).length;
  }

  // Statistics Methods
  getTotalEmployees(): number {
    return this.employees.length;
  }

  getPendingLeavesCount(): number {
    return this.leaves.filter(l => l.status === 'PENDING').length;
  }

  getPendingAdvancesCount(): number {
    return this.advances.filter(a => a.status === 'PENDING').length;
  }

  // Department Methods
  getAllDepartments(): Department[] {
    return this.departments;
  }

  createDepartment(name: string): Department {
    const dept: Department = {
      id: this.departmentIdCounter++,
      name,
      createdAt: new Date().toISOString(),
    };
    this.departments.push(dept);
    this.saveToStorage(); // حفظ البيانات
    return dept;
  }

  updateDepartment(id: number, name: string): Department | undefined {
    const dept = this.departments.find(d => d.id === id);
    if (dept) {
      dept.name = name;
      this.saveToStorage(); // حفظ البيانات
      return dept;
    }
    return undefined;
  }

  deleteDepartment(id: number): boolean {
    const index = this.departments.findIndex(d => d.id === id);
    if (index !== -1) {
      this.departments.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  // Job Title Methods
  getAllJobTitles(): JobTitle[] {
    return this.jobTitles;
  }

  createJobTitle(title: string): JobTitle {
    const jobTitle: JobTitle = {
      id: this.jobTitleIdCounter++,
      title,
      createdAt: new Date().toISOString(),
    };
    this.jobTitles.push(jobTitle);
    this.saveToStorage(); // حفظ البيانات
    return jobTitle;
  }

  updateJobTitle(id: number, title: string): JobTitle | undefined {
    const jobTitle = this.jobTitles.find(j => j.id === id);
    if (jobTitle) {
      jobTitle.title = title;
      this.saveToStorage(); // حفظ البيانات
      return jobTitle;
    }
    return undefined;
  }

  deleteJobTitle(id: number): boolean {
    const index = this.jobTitles.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobTitles.splice(index, 1);
      this.saveToStorage(); // حفظ البيانات
      return true;
    }
    return false;
  }

  // Company Settings Methods
  getCompanySettings(): CompanySettings | null {
    return this.companySettings;
  }

  updateCompanySettings(settings: Partial<CompanySettings>): CompanySettings {
    if (this.companySettings) {
      this.companySettings = { ...this.companySettings, ...settings };
    } else {
      this.companySettings = {
        id: 1,
        companyName: settings.companyName || 'الشركة',
        ...settings,
      } as CompanySettings;
    }
    this.saveToStorage(); // حفظ البيانات
    return this.companySettings;
  }

  // ========== Attendance Methods ==========
  
  // إنشاء سجل حضور
  createAttendance(attendanceData: Partial<Attendance>): Attendance {
    const attendance: Attendance = {
      id: this.attendanceIdCounter++,
      employeeId: attendanceData.employeeId!,
      date: attendanceData.date || new Date(),
      checkIn: attendanceData.checkIn,
      checkOut: attendanceData.checkOut,
      workHours: attendanceData.workHours,
      lateMinutes: attendanceData.lateMinutes || 0,
      overtimeHours: attendanceData.overtimeHours,
      earlyLeaveMinutes: attendanceData.earlyLeaveMinutes,
      status: attendanceData.status || 'PRESENT',
      notes: attendanceData.notes,
    };
    this.attendances.push(attendance);
    this.saveToStorage();
    return attendance;
  }

  // الحصول على سجل حضور بالـ ID
  getAttendanceById(id: number): Attendance | undefined {
    return this.attendances.find(a => a.id === id);
  }

  // الحصول على سجلات حضور موظف معين
  getAttendancesByEmployeeId(employeeId: number): Attendance[] {
    return this.attendances.filter(a => a.employeeId === employeeId);
  }

  // الحصول على سجل حضور موظف في تاريخ معين
  getAttendanceByEmployeeAndDate(employeeId: number, date: Date): Attendance | undefined {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    return this.attendances.find(a => {
      const attDate = new Date(a.date);
      attDate.setHours(0, 0, 0, 0);
      return a.employeeId === employeeId && attDate.getTime() === searchDate.getTime();
    });
  }

  // الحصول على جميع سجلات الحضور
  getAllAttendances(): Attendance[] {
    return this.attendances;
  }

  // تحديث سجل حضور
  updateAttendance(id: number, updates: Partial<Attendance>): Attendance | undefined {
    const attendance = this.attendances.find(a => a.id === id);
    if (attendance) {
      Object.assign(attendance, updates);
      this.saveToStorage();
      return attendance;
    }
    return undefined;
  }

  // حذف سجل حضور
  deleteAttendance(id: number): boolean {
    const index = this.attendances.findIndex(a => a.id === id);
    if (index !== -1) {
      this.attendances.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // ========== Payroll Records Methods ==========
  
  createPayrollRecord(data: Partial<PayrollRecord>): PayrollRecord {
    const record: PayrollRecord = {
      id: this.payrollRecordIdCounter++,
      employeeId: data.employeeId!,
      month: data.month!,
      year: data.year!,
      basicSalary: data.basicSalary || 0,
      housingAllowance: data.housingAllowance || 0,
      transportAllowance: data.transportAllowance || 0,
      totalAllowances: data.totalAllowances || 0,
      grossSalary: data.grossSalary || 0,
      presentDays: data.presentDays || 0,
      absentDays: data.absentDays || 0,
      lateDays: data.lateDays || 0,
      lateDeduction: data.lateDeduction || 0,
      absentDeduction: data.absentDeduction || 0,
      overtimeHours: data.overtimeHours || 0,
      overtimeAmount: data.overtimeAmount || 0,
      advanceDeduction: data.advanceDeduction || 0,
      gosiDeduction: data.gosiDeduction || 0,
      otherDeductions: data.otherDeductions || 0,
      totalDeductions: data.totalDeductions || 0,
      netSalary: data.netSalary || 0,
      status: data.status || 'DRAFT',
      paidDate: data.paidDate,
      notes: data.notes,
      createdAt: new Date(),
    };
    this.payrollRecords.push(record);
    this.saveToStorage();
    return record;
  }

  getPayrollRecordById(id: number): PayrollRecord | undefined {
    return this.payrollRecords.find(p => p.id === id);
  }

  getPayrollRecordsByEmployee(employeeId: number): PayrollRecord[] {
    return this.payrollRecords.filter(p => p.employeeId === employeeId);
  }

  getPayrollRecordByEmployeeAndPeriod(employeeId: number, month: number, year: number): PayrollRecord | undefined {
    return this.payrollRecords.find(p => 
      p.employeeId === employeeId && p.month === month && p.year === year
    );
  }

  getAllPayrollRecords(): PayrollRecord[] {
    return this.payrollRecords;
  }

  updatePayrollRecord(id: number, updates: Partial<PayrollRecord>): PayrollRecord | undefined {
    const record = this.payrollRecords.find(p => p.id === id);
    if (record) {
      Object.assign(record, updates);
      this.saveToStorage();
      return record;
    }
    return undefined;
  }

  deletePayrollRecord(id: number): boolean {
    const index = this.payrollRecords.findIndex(p => p.id === id);
    if (index !== -1) {
      this.payrollRecords.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // ========== Notifications Methods ==========
  
  createNotification(data: Partial<Notification>): Notification {
    const notification: Notification = {
      id: this.notificationIdCounter++,
      userId: data.userId!,
      title: data.title!,
      message: data.message!,
      type: data.type || 'INFO',
      read: false,
      createdAt: new Date(),
      link: data.link,
    };
    this.notifications.push(notification);
    this.saveToStorage();
    return notification;
  }

  getNotificationsByUserId(userId: number): Notification[] {
    return this.notifications.filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUnreadNotificationsByUserId(userId: number): Notification[] {
    return this.notifications.filter(n => n.userId === userId && !n.read)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationAsRead(id: number): boolean {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  markAllNotificationsAsRead(userId: number): boolean {
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    userNotifications.forEach(n => n.read = true);
    this.saveToStorage();
    return true;
  }

  deleteNotification(id: number): boolean {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}
