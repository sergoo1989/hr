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
        user: {
            id: number;
            username: string;
            role: "ADMIN" | "EMPLOYEE";
            employee: import("../database/in-memory-db").Employee;
        };
    }>;
    validateUser(userId: number): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        username: string;
        password: string;
        role: "ADMIN" | "EMPLOYEE";
        employeeId?: number;
    }>;
}
