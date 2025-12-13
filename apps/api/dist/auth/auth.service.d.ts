import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private db;
    constructor(jwtService: JwtService);
    register(username: string, password: string, role: string, employeeId?: number): Promise<{
        id: number;
        username: string;
        role: "ADMIN" | "EMPLOYEE";
    }>;
    login(username: string, password: string): Promise<{
        access_token: string;
        role: "ADMIN" | "EMPLOYEE";
        mustChangePassword: boolean;
        user: {
            id: number;
            username: string;
            role: "ADMIN" | "EMPLOYEE";
            employee: import("../database/in-memory-db").Employee;
        };
    }>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateAccount(activationToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateUser(userId: number): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        username: string;
        password: string;
        role: "ADMIN" | "EMPLOYEE";
        employeeId?: number;
        isActive: boolean;
        mustChangePassword: boolean;
        activationToken?: string;
        email?: string;
    }>;
}
