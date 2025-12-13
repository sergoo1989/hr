export declare class EmailService {
    private transporter;
    constructor();
    sendEmployeeActivationEmail(email: string, employeeName: string, username: string, temporaryPassword: string, activationLink: string): Promise<boolean>;
    sendPasswordChangedConfirmation(email: string, employeeName: string): Promise<boolean>;
}
