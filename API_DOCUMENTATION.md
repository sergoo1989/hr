# توثيق API - نظام إدارة الموارد البشرية والرواتب

## نظرة عامة
نظام متكامل لإدارة الموارد البشرية والرواتب متوافق مع قانون العمل السعودي

**Base URL:** `http://localhost:4000`

---

## 📌 المصادقة (Authentication)

### تسجيل الدخول
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "employeeId": 1
  }
}
```

**جميع الـ endpoints التالية تحتاج إلى:**
```
Authorization: Bearer {access_token}
```

---

## 👤 مسارات الموظف (Employee Routes)

### 1. لوحة معلومات الموظف الكاملة
```http
GET /employees/me/dashboard

Response:
{
  "employeeName": "أحمد محمد",
  "employeeCode": "EMP001",
  "lastLogin": "2025-12-13T10:00:00Z",
  "leaveBalance": {
    "entitledDays": 30,
    "usedDays": 5,
    "remainingDays": 25,
    "dailyRate": 166.67,
    "cashBalance": 4166.75
  },
  "travelTicket": {
    "hasTicket": true,
    "isUsed": false,
    "canUse": true
  },
  "endOfService": {
    "eligible": true,
    "serviceYears": 3.5,
    "lastSalary": 5000,
    "estimatedAmount": 8750.00
  },
  "alerts": [
    {
      "type": "DOCUMENT_EXPIRY",
      "severity": "WARNING",
      "message": "إنتهاء الإقامة",
      "date": "2026-01-15T00:00:00Z"
    }
  ],
  "quickStats": {
    "totalAlerts": 1,
    "criticalAlerts": 0
  }
}
```

### 2. رصيد الإجازات
```http
GET /employees/me/leave-balance

Response:
{
  "entitledDays": 30,
  "usedDays": 5,
  "remainingDays": 25,
  "dailyRate": 166.67,
  "cashBalance": 4166.75
}
```

### 3. حالة تذكرة السفر
```http
GET /employees/me/travel-ticket

Response:
{
  "hasTicket": true,
  "ticket": {
    "id": 1,
    "year": 2025,
    "issued": false
  },
  "isUsed": false,
  "canUse": true
}
```

### 4. استخدام تذكرة السفر
```http
POST /employees/me/travel-ticket/use

Response:
{
  "id": 1,
  "employeeId": 1,
  "year": 2025,
  "issued": true,
  "issueDate": "2025-12-13T10:00:00Z"
}
```

### 5. بدل نهاية الخدمة المتوقع
```http
GET /employees/me/end-of-service

Response:
{
  "eligible": true,
  "serviceYears": 3.5,
  "lastSalary": 5000,
  "estimatedAmount": 8750.00
}
```

### 6. البيانات الشخصية
```http
GET /employees/me

Response:
{
  "id": 1,
  "employeeCode": "EMP001",
  "name": "أحمد محمد",
  "nationalId": "1234567890",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "iqamaNumber": "2123456789",
  "iqamaExpiry": "2026-01-15T00:00:00Z",
  "passportNumber": "A12345678",
  "passportExpiry": "2028-05-20T00:00:00Z",
  "bankName": "البنك الأهلي",
  "iban": "SA1234567890123456789012",
  "contracts": [...],
  "leaves": [...],
  "advances": [...],
  "assets": [...]
}
```

### 7. طلب إجازة
```http
POST /employees/me/leaves
Content-Type: application/json

{
  "leaveType": "ANNUAL",
  "startDate": "2025-12-20",
  "endDate": "2025-12-25",
  "daysCount": 5,
  "paid": true,
  "paidAmount": 0
}

Response:
{
  "id": 5,
  "employeeId": 1,
  "leaveType": "ANNUAL",
  "status": "PENDING",
  "requestDate": "2025-12-13T10:00:00Z"
}
```

### 8. طلب سلفة
```http
POST /employees/me/advances
Content-Type: application/json

{
  "amount": 2000
}

Response:
{
  "id": 3,
  "employeeId": 1,
  "amount": 2000,
  "date": "2025-12-13T10:00:00Z",
  "status": "PENDING"
}
```

### 9. قائمة الإجازات
```http
GET /employees/me/leaves

Response:
{
  "leaves": [...],
  "totalDays": 30,
  "usedDays": 5,
  "remainingDays": 25,
  "leaveBalance": 4166.75
}
```

### 10. سجل الحضور
```http
GET /employees/me/attendance

Response: [
  {
    "id": 1,
    "date": "2025-12-13",
    "checkIn": "08:00:00",
    "checkOut": "17:00:00"
  }
]
```

### 11. العهود المستلمة
```http
GET /employees/me/assets

Response: [
  {
    "id": 1,
    "assetType": "LAPTOP",
    "description": "Dell Latitude",
    "assignedDate": "2025-01-01",
    "returned": false
  }
]
```

### 12. المستندات
```http
GET /employees/me/documents

Response: [
  {
    "id": 1,
    "docType": "WORK_PERMIT",
    "expiryDate": "2026-03-15",
    "number": "WP123456"
  }
]
```

---

## 🔐 مسارات الإدارة (Admin Routes)

### 1. لوحة التحكم الرئيسية
```http
GET /dashboard

Response:
{
  "stats": {
    "totalEmployees": 150,
    "activeEmployees": 145,
    "inactiveEmployees": 5,
    "pendingLeaves": 12,
    "expiringDocuments": 8,
    "monthlyPayroll": 750000.00,
    "pendingAdvances": 5,
    "recentTerminations": 2
  },
  "charts": {
    "leaveDistribution": [
      { "type": "ANNUAL", "count": 45 },
      { "type": "SICK", "count": 12 }
    ],
    "monthlyAttendance": [
      { "month": "2025-12", "attendanceRate": "95.50" }
    ],
    "salaryDistribution": [
      { "range": "5000-10000", "count": 65 }
    ]
  },
  "tables": {
    "recentLeaves": [...],
    "expiringDocs": [...],
    "recentAdvances": [...]
  }
}
```

### 2. الإحصائيات السريعة
```http
GET /dashboard/stats

Response:
{
  "totalEmployees": 150,
  "activeEmployees": 145,
  "pendingLeaves": 12,
  "expiringDocuments": 8,
  "monthlyPayroll": 750000.00
}
```

### 3. بيانات الرسوم البيانية
```http
GET /dashboard/charts

Response:
{
  "leaveDistribution": [...],
  "monthlyAttendance": [...],
  "salaryDistribution": [...]
}
```

### 4. تنبيهات المستندات المنتهية
```http
GET /dashboard/alerts/expiry

Response: [
  {
    "employeeId": 1,
    "employeeName": "أحمد محمد",
    "employeeCode": "EMP001",
    "documentType": "IQAMA",
    "expiryDate": "2026-01-15",
    "daysRemaining": 33,
    "severity": "WARNING"
  }
]
```

### 5. تقرير الرواتب
```http
GET /dashboard/reports/payroll?startDate=2025-01-01&endDate=2025-12-31

Response: [
  {
    "id": 1,
    "period": "2025-12-01 - 2025-12-31",
    "status": "PAID",
    "totalGross": 875000.00,
    "totalDeductions": 125000.00,
    "totalNet": 750000.00,
    "employeeCount": 150,
    "items": [...]
  }
]
```

### 6. تقرير الإجازات
```http
GET /dashboard/reports/leave?startDate=2025-01-01&endDate=2025-12-31

Response:
{
  "summary": {
    "total": 234,
    "byType": {
      "ANNUAL": 180,
      "SICK": 45,
      "EMERGENCY": 9
    },
    "byStatus": {
      "APPROVED": 210,
      "PENDING": 12,
      "REJECTED": 12
    },
    "totalDays": 1850
  },
  "leaves": [...]
}
```

### 7. قائمة الموظفين
```http
GET /employees

Response: [
  {
    "id": 1,
    "employeeCode": "EMP001",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567"
  }
]
```

### 8. إضافة موظف جديد
```http
POST /employees
Content-Type: application/json

{
  "name": "محمد علي",
  "nameEn": "Mohammed Ali",
  "nationalId": "1234567890",
  "email": "mohammed@example.com",
  "phone": "+966501234567",
  "iqamaNumber": "2123456789",
  "iqamaExpiry": "2026-12-31",
  "passportNumber": "P12345678",
  "passportExpiry": "2028-12-31",
  "bankName": "البنك الأهلي",
  "iban": "SA1234567890123456789012",
  "joinDate": "2025-01-01"
}

Response:
{
  "id": 151,
  "employeeCode": "EMP151",
  "name": "محمد علي",
  ...
}
```

### 9. تحديث بيانات موظف
```http
PUT /employees/:id
Content-Type: application/json

{
  "phone": "+966509876543",
  "email": "new.email@example.com"
}

Response:
{
  "id": 1,
  "name": "أحمد محمد",
  "phone": "+966509876543",
  "email": "new.email@example.com",
  ...
}
```

---

## 📅 نظام الجدولة (Scheduler)

### 1. فحص يدوي للمستندات
```http
GET /scheduler/check-documents

Response:
{
  "message": "تم إكمال الفحص بنجاح"
}
```

### 2. تقرير المستندات المنتهية
```http
GET /scheduler/expiry-report

Response:
{
  "totalEmployees": 8,
  "critical": 2,
  "warning": 4,
  "info": 2,
  "details": [
    {
      "employeeId": 1,
      "employeeName": "أحمد محمد",
      "employeeCode": "EMP001",
      "documents": [
        {
          "type": "IQAMA",
          "expiryDate": "2026-01-15",
          "daysRemaining": 33,
          "severity": "WARNING"
        }
      ]
    }
  ]
}
```

---

## 💰 نظام الرواتب (Payroll)

### 1. توليد كشف رواتب شهري
```http
POST /payroll/generate
Content-Type: application/json

{
  "periodStart": "2025-12-01",
  "periodEnd": "2025-12-31"
}

Response:
{
  "id": 12,
  "periodStart": "2025-12-01",
  "periodEnd": "2025-12-31",
  "status": "DRAFT",
  "totalGross": 875000.00,
  "totalNet": 750000.00,
  "employeeCount": 150
}
```

### 2. كشف راتب موظف
```http
GET /payroll/employee/:employeeId/month/:month

Response:
{
  "employeeId": 1,
  "employeeName": "أحمد محمد",
  "month": "2025-12",
  "basicSalary": 5000,
  "housingAllow": 2000,
  "transportAllow": 500,
  "grossPay": 7500,
  "totalDeductions": 500,
  "netPay": 7000,
  "iban": "SA1234567890123456789012"
}
```

---

## 🎯 ميزات إضافية

### الخوارزميات المطبقة:
1. ✅ **calculateLeaveBalance** - حساب رصيد الإجازات (أيام + قيمة نقدية)
2. ✅ **checkTravelTicketEligibility** - إدارة تذاكر السفر السنوية
3. ✅ **calculateEndOfService** - حساب بدل نهاية الخدمة حسب قانون العمل السعودي
4. ✅ **Document Expiry Scheduler** - فحص تلقائي يومي للمستندات المنتهية

### التوافق مع قانون العمل السعودي:
- ✅ حساب الإجازات السنوية (21-30 يوم حسب سنوات الخدمة)
- ✅ الإجازات المرضية (100%, 75%, 0% حسب الأيام)
- ✅ بدل نهاية الخدمة (نصف راتب أول 5 سنوات، راتب كامل بعد ذلك)
- ✅ أجزاء بدل نهاية الخدمة (1/3, 2/3, كامل حسب نوع الإنهاء)
- ✅ تذاكر السفر السنوية
- ✅ سجل التدقيق (Audit Log) لجميع العمليات الحساسة

---

## 📊 حالات الـ Status

### Leave Status:
- `PENDING` - قيد المراجعة
- `APPROVED` - موافق عليها
- `REJECTED` - مرفوضة

### Advance Status:
- `PENDING` - قيد المراجعة
- `APPROVED` - موافق عليها
- `REJECTED` - مرفوضة
- `PAID` - تم الصرف

### Payroll Status:
- `DRAFT` - مسودة
- `PENDING_APPROVAL` - بانتظار الموافقة
- `APPROVED` - موافق عليه
- `LOCKED` - مؤمن
- `PAID` - تم الدفع

### Alert Severity:
- `CRITICAL` - حرج (أقل من 30 يوم)
- `WARNING` - تحذير (30-60 يوم)
- `INFO` - معلومة (60-90 يوم)

---

## 🔒 الأدوار (Roles)

### EMPLOYEE
- الوصول إلى `/employees/me/*`
- عرض البيانات الشخصية فقط
- تقديم طلبات (إجازات، سلف)

### ADMIN
- الوصول الكامل لجميع المسارات
- إدارة جميع الموظفين
- الموافقات والتقارير
- لوحات التحكم

---

## 📝 ملاحظات مهمة

1. **التاريخ والوقت**: جميع التواريخ بصيغة ISO 8601
2. **العملة**: جميع المبالغ بالريال السعودي
3. **المصادقة**: Bearer Token مطلوب لجميع المسارات ما عدا `/auth/login`
4. **الجدولة**: Cron job يعمل يومياً الساعة 9 صباحاً لفحص المستندات
5. **Audit Log**: جميع العمليات الحساسة يتم تسجيلها تلقائياً

---

## 🚀 البدء السريع

1. تسجيل الدخول:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

2. استخدام Token:
```bash
curl -X GET http://localhost:4000/employees/me/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**تم التطوير بواسطة**: نظام إدارة الموارد البشرية المتكامل  
**الإصدار**: 1.0.0  
**آخر تحديث**: 13 ديسمبر 2025
