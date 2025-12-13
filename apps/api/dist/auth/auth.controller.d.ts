import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        password: string;
        role: string;
        employeeId?: number;
    }): Promise<{
        id: number;
        username: string;
        role: "ADMIN" | "EMPLOYEE";
    }>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        role: "ADMIN" | "EMPLOYEE";
        user: {
            id: number;
            username: string;
            role: "ADMIN" | "EMPLOYEE";
            employee: import("../database/in-memory-db").Employee;
        };
    }>;
}
