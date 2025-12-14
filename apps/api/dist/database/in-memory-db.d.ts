export interface User {
    id: number;
    username: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE';
    employeeId?: number;
    isActive: boolean;
    mustChangePassword: boolean;
    activationToken?: string;
    email?: string;
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
    workType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT';
    sponsorshipType?: 'COMPANY' | 'PERSONAL' | 'EXTERNAL';
    ticketEntitlement?: boolean;
    ticketClass?: 'ECONOMY' | 'BUSINESS';
    contractDuration?: number;
    contractLeaveDays?: number;
    passportNumber?: string;
    passportExpiryDate?: Date | string;
    workPermitExpiryDate?: Date | string;
    passportFeesExpiryDate?: Date | string;
    medicalInsuranceExpiryDate?: Date | string;
    contractEndDate?: Date | string;
    terminationReason?: 'NORMAL_END' | 'RESIGNATION' | 'TERMINATION';
    terminationDate?: Date | string;
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
    confirmed: boolean;
    confirmedDate?: Date | string;
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
    presentDays: number;
    absentDays: number;
    lateDays: number;
    lateDeduction: number;
    absentDeduction: number;
    overtimeHours: number;
    overtimeAmount: number;
    advanceDeduction: number;
    gosiDeduction: number;
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
export declare class InMemoryDatabase {
    private static instance;
    private storage;
    users: User[];
    employees: Employee[];
    leaves: Leave[];
    advances: Advance[];
    assets: Asset[];
    departments: Department[];
    jobTitles: JobTitle[];
    companySettings: CompanySettings | null;
    attendances: Attendance[];
    payrollRecords: PayrollRecord[];
    notifications: Notification[];
    private userIdCounter;
    private employeeIdCounter;
    private leaveIdCounter;
    private advanceIdCounter;
    private assetIdCounter;
    private departmentIdCounter;
    private jobTitleIdCounter;
    private attendanceIdCounter;
    private payrollRecordIdCounter;
    private notificationIdCounter;
    private constructor();
    static getInstance(): InMemoryDatabase;
    private loadFromStorage;
    saveToStorage(): void;
    getAllData(): {
        users: User[];
        employees: Employee[];
        leaves: Leave[];
        advances: Advance[];
        assets: Asset[];
        departments: Department[];
        jobTitles: JobTitle[];
        companySettings: CompanySettings;
        attendances: Attendance[];
        payrollRecords: PayrollRecord[];
        notifications: Notification[];
        counters: {
            userIdCounter: number;
            employeeIdCounter: number;
            leaveIdCounter: number;
            advanceIdCounter: number;
            assetIdCounter: number;
            departmentIdCounter: number;
            jobTitleIdCounter: number;
            attendanceIdCounter: number;
            payrollRecordIdCounter: number;
            notificationIdCounter: number;
        };
    };
    loadFromBackup(backupData: any): {
        success: boolean;
    };
    seedInitialData(): Promise<void>;
    createUser(username: string, password: string, role: 'ADMIN' | 'EMPLOYEE', employeeId?: number, email?: string, isActive?: boolean, mustChangePassword?: boolean): Promise<User>;
    findUserByUsername(username: string): User | undefined;
    findAllUsers(): User[];
    findUserById(id: number): User | undefined;
    findUserByEmployeeId(employeeId: number): User | undefined;
    findUserByActivationToken(token: string): User | undefined;
    updateUserPassword(userId: number, newHashedPassword: string): void;
    activateUser(userId: number): void;
    private generateActivationToken;
    createEmployee(data: Omit<Employee, 'id'>): Employee;
    findEmployeeById(id: number): Employee | undefined;
    findAllEmployees(): Employee[];
    updateEmployee(id: number, data: Partial<Employee>): Employee | undefined;
    deleteEmployee(id: number): boolean;
    deleteUserByEmployeeId(employeeId: number): boolean;
    createLeave(data: Omit<Leave, 'id'>): Leave;
    findLeavesByEmployeeId(employeeId: number): Leave[];
    findPendingLeaves(): Leave[];
    findAllLeaves(): Leave[];
    updateLeaveStatus(id: number, status: 'APPROVED' | 'REJECTED'): Leave | undefined;
    deleteLeave(id: number): boolean;
    createAdvance(data: Omit<Advance, 'id'>): Advance;
    findAdvancesByEmployeeId(employeeId: number): Advance[];
    findPendingAdvances(): Advance[];
    updateAdvanceStatus(id: number, status: 'APPROVED' | 'REJECTED'): Advance | undefined;
    deleteAdvance(id: number): boolean;
    createAsset(data: Omit<Asset, 'id'>): Asset;
    findAssetsByEmployeeId(employeeId: number): Asset[];
    findAssetById(id: number): Asset | undefined;
    findAllAssets(): Asset[];
    confirmAssetReceipt(assetId: number, employeeId: number): Asset | undefined;
    deleteAsset(id: number): boolean;
    getLeaves(): Leave[];
    getAllLeaves(): Leave[];
    getAdvances(): Advance[];
    getAllAdvances(): Advance[];
    getAllEmployees(): Employee[];
    getActiveAssetsCount(): number;
    getTotalEmployees(): number;
    getPendingLeavesCount(): number;
    getPendingAdvancesCount(): number;
    getAllDepartments(): Department[];
    createDepartment(name: string): Department;
    updateDepartment(id: number, name: string): Department | undefined;
    deleteDepartment(id: number): boolean;
    getAllJobTitles(): JobTitle[];
    createJobTitle(title: string): JobTitle;
    updateJobTitle(id: number, title: string): JobTitle | undefined;
    deleteJobTitle(id: number): boolean;
    getCompanySettings(): CompanySettings | null;
    updateCompanySettings(settings: Partial<CompanySettings>): CompanySettings;
    createAttendance(attendanceData: Partial<Attendance>): Attendance;
    getAttendanceById(id: number): Attendance | undefined;
    getAttendancesByEmployeeId(employeeId: number): Attendance[];
    getAttendanceByEmployeeAndDate(employeeId: number, date: Date): Attendance | undefined;
    getAllAttendances(): Attendance[];
    updateAttendance(id: number, updates: Partial<Attendance>): Attendance | undefined;
    deleteAttendance(id: number): boolean;
    createPayrollRecord(data: Partial<PayrollRecord>): PayrollRecord;
    getPayrollRecordById(id: number): PayrollRecord | undefined;
    getPayrollRecordsByEmployee(employeeId: number): PayrollRecord[];
    getPayrollRecordByEmployeeAndPeriod(employeeId: number, month: number, year: number): PayrollRecord | undefined;
    getAllPayrollRecords(): PayrollRecord[];
    updatePayrollRecord(id: number, updates: Partial<PayrollRecord>): PayrollRecord | undefined;
    deletePayrollRecord(id: number): boolean;
    createNotification(data: Partial<Notification>): Notification;
    getNotificationsByUserId(userId: number): Notification[];
    getUnreadNotificationsByUserId(userId: number): Notification[];
    markNotificationAsRead(id: number): boolean;
    markAllNotificationsAsRead(userId: number): boolean;
    deleteNotification(id: number): boolean;
}
