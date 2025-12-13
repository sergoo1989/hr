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
        mustChangePassword: boolean;
        user: {
            id: number;
            username: string;
            role: "ADMIN" | "EMPLOYEE";
            employee: import("../database/in-memory-db").Employee;
        };
    }>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    activateAccount(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
