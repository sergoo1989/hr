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

  private userIdCounter = 1;
  private employeeIdCounter = 1;
  private leaveIdCounter = 1;
  private advanceIdCounter = 1;
  private assetIdCounter = 1;
  private departmentIdCounter = 1;
  private jobTitleIdCounter = 1;

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
      
      // استعادة الـ Counters
      this.userIdCounter = data.userIdCounter || 1;
      this.employeeIdCounter = data.employeeIdCounter || 1;
      this.leaveIdCounter = data.leaveIdCounter || 1;
      this.advanceIdCounter = data.advanceIdCounter || 1;
      this.assetIdCounter = data.assetIdCounter || 1;
      this.departmentIdCounter = data.departmentIdCounter || 1;
      this.jobTitleIdCounter = data.jobTitleIdCounter || 1;
      
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
      userIdCounter: this.userIdCounter,
      employeeIdCounter: this.employeeIdCounter,
      leaveIdCounter: this.leaveIdCounter,
      advanceIdCounter: this.advanceIdCounter,
      assetIdCounter: this.assetIdCounter,
      departmentIdCounter: this.departmentIdCounter,
      jobTitleIdCounter: this.jobTitleIdCounter,
    };
    this.storage.saveData(data);
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

  updateAdvanceStatus(id: number, status: 'APPROVED' | 'REJECTED'): Advance | undefined {
    const advance = this.advances.find(a => a.id === id);
    if (advance) {
      advance.status = status;
      this.saveToStorage(); // حفظ البيانات
      return advance;
    }
    return undefined;
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
}
