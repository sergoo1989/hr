"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password',
            },
        });
    }
    async sendEmployeeActivationEmail(email, employeeName, username, temporaryPassword, activationLink) {
        try {
            const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              color: #333;
              line-height: 1.8;
            }
            .welcome-box {
              background: #f8f9fa;
              border-right: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .credentials {
              background: #fff3cd;
              border: 2px solid #ffc107;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .credential-item {
              margin: 10px 0;
              font-size: 16px;
            }
            .credential-label {
              font-weight: bold;
              color: #856404;
            }
            .credential-value {
              background: white;
              padding: 8px 12px;
              border-radius: 4px;
              display: inline-block;
              margin-right: 10px;
              font-family: 'Courier New', monospace;
              color: #333;
            }
            .btn-activate {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 18px;
              margin: 20px 0;
              text-align: center;
            }
            .btn-activate:hover {
              opacity: 0.9;
            }
            .warning {
              background: #f8d7da;
              border-right: 4px solid #dc3545;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
              color: #721c24;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
            .steps {
              background: #e7f3ff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .step {
              margin: 15px 0;
              padding-right: 30px;
              position: relative;
            }
            .step-number {
              position: absolute;
              right: 0;
              top: 0;
              background: #667eea;
              color: white;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🎉 مرحباً بك في نظام إدارة الموارد البشرية</h1>
            </div>
            
            <div class="content">
              <div class="welcome-box">
                <h2 style="color: #667eea; margin-top: 0;">عزيزي/عزيزتي ${employeeName}</h2>
                <p>تم إنشاء حساب خاص بك في نظام إدارة الموارد البشرية. يمكنك الآن الوصول إلى لوحة التحكم الخاصة بك.</p>
              </div>

              <h3 style="color: #667eea;">📋 بيانات الدخول المؤقتة:</h3>
              <div class="credentials">
                <div class="credential-item">
                  <span class="credential-label">اسم المستخدم:</span>
                  <span class="credential-value">${username}</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">كلمة المرور المؤقتة:</span>
                  <span class="credential-value">${temporaryPassword}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ هام جداً:</strong> لأسباب أمنية، يجب عليك تغيير كلمة المرور المؤقتة عند أول تسجيل دخول.
              </div>

              <h3 style="color: #667eea;">🚀 خطوات التفعيل:</h3>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  انقر على زر "تفعيل الحساب" أدناه
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  استخدم اسم المستخدم وكلمة المرور المؤقتة للدخول
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  سيُطلب منك تغيير كلمة المرور فوراً
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  اختر كلمة مرور قوية وآمنة (8 أحرف على الأقل)
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  ابدأ باستخدام النظام بحرية!
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${activationLink}" class="btn-activate">
                  🔐 تفعيل الحساب الآن
                </a>
              </div>

              <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                إذا واجهت أي مشكلة في الدخول، يرجى التواصل مع قسم الموارد البشرية.
              </p>
            </div>

            <div class="footer">
              <p>نظام إدارة الموارد البشرية</p>
              <p style="margin: 5px 0;">هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه</p>
            </div>
          </div>
        </body>
        </html>
      `;
            const info = await this.transporter.sendMail({
                from: `"نظام الموارد البشرية" <${process.env.EMAIL_USER || 'noreply@hr-system.com'}>`,
                to: email,
                subject: '🎉 تفعيل حسابك في نظام إدارة الموارد البشرية',
                html: htmlContent,
            });
            console.log('✅ تم إرسال بريد التفعيل بنجاح:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ خطأ في إرسال البريد الإلكتروني:', error);
            return false;
        }
    }
    async sendPasswordChangedConfirmation(email, employeeName) {
        try {
            const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
              color: #333;
              line-height: 1.8;
            }
            .success-box {
              background: #d4edda;
              border-right: 4px solid #28a745;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
              color: #155724;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>✅ تم تغيير كلمة المرور بنجاح</h1>
            </div>
            
            <div class="content">
              <h2 style="color: #28a745;">عزيزي/عزيزتي ${employeeName}</h2>
              
              <div class="success-box">
                <p style="margin: 0;"><strong>تم تغيير كلمة المرور الخاصة بحسابك بنجاح.</strong></p>
                <p style="margin: 10px 0 0 0;">يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.</p>
              </div>

              <p>إذا لم تقم بهذا التغيير، يرجى التواصل مع قسم الموارد البشرية فوراً.</p>
            </div>

            <div class="footer">
              <p>نظام إدارة الموارد البشرية</p>
            </div>
          </div>
        </body>
        </html>
      `;
            await this.transporter.sendMail({
                from: `"نظام الموارد البشرية" <${process.env.EMAIL_USER || 'noreply@hr-system.com'}>`,
                to: email,
                subject: '✅ تأكيد تغيير كلمة المرور',
                html: htmlContent,
            });
            return true;
        }
        catch (error) {
            console.error('❌ خطأ في إرسال بريد التأكيد:', error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map