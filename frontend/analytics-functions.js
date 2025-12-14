// ============= ANALYTICS FUNCTIONS =============
let analyticsData = null;
let analyticsCharts = {};

function switchAnalyticsSection(sectionName) {
    document.querySelectorAll('.analytics-section').forEach(s => s.style.display = 'none');
    document.getElementById('analytics' + sectionName.charAt(0).toUpperCase() + sectionName.slice(1)).style.display = 'block';
}

async function loadAnalytics() {
    if (analyticsData) return;
    try {
        const token = localStorage.getItem('token');
        const API_URL = Config.getApiUrl();
        const employeesRes = await fetch(`${API_URL}/employees`, { headers: { 'Authorization': `Bearer ${token}` }});
        analyticsData = { employees: await employeesRes.json() };
        document.getElementById('analyticsContent').style.display = 'block';
        document.getElementById('analyticsLoading').style.display = 'none';
        loadAnalyticsStats();
        loadAnalyticsCharts();
        loadLeaveBalancesAnalytics();
        loadEndOfServiceAnalytics();
        loadAssetsAnalytics();
        loadTicketsAnalytics();
        loadDocumentsAlertsAnalytics();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('analyticsLoading').innerHTML = '<p style="color: #f44336;">❌ خطأ في تحميل التحليلات. حاول مرة أخرى.</p>';
    }
}

function loadAnalyticsStats() {
    const employees = analyticsData.employees;
    const saudis = employees.filter(e => e.nationality === 'SAUDI').length;
    const nonSaudis = employees.filter(e => e.nationality === 'NON_SAUDI').length;
    const totalSalary = employees.reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0);
    document.getElementById('analyticsStatsGrid').innerHTML = `
        <div class="stat-card"><div class="stat-value">${employees.length}</div><div class="stat-label">إجمالي الموظفين</div></div>
        <div class="stat-card" style="background: #e3f2fd;"><div class="stat-value" style="color: #1976d2;">${saudis}</div><div class="stat-label">موظفون سعوديون</div></div>
        <div class="stat-card" style="background: #fff3e0;"><div class="stat-value" style="color: #f57c00;">${nonSaudis}</div><div class="stat-label">موظفون غير سعوديين</div></div>
        <div class="stat-card" style="background: linear-gradient(135deg, #667eea, #764ba2);"><div class="stat-value" style="color: white;">${totalSalary.toLocaleString()} ر.س</div><div class="stat-label" style="color: rgba(255,255,255,0.9);">كشف الرواتب</div></div>
    `;
}

function loadAnalyticsCharts() {
    const employees = analyticsData.employees;
    
    // Department Chart
    const deptCounts = {};
    employees.forEach(e => { const d = e.department || 'غير محدد'; deptCounts[d] = (deptCounts[d] || 0) + 1; });
    if (analyticsCharts.department) analyticsCharts.department.destroy();
    analyticsCharts.department = new Chart(document.getElementById('departmentChart'), {
        type: 'pie',
        data: { labels: Object.keys(deptCounts), datasets: [{ data: Object.values(deptCounts), backgroundColor: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'] }] },
        options: { responsive: true }
    });
    
    // Nationality Chart
    const saudis = employees.filter(e => e.nationality === 'SAUDI').length;
    const nonSaudis = employees.filter(e => e.nationality === 'NON_SAUDI').length;
    if (analyticsCharts.nationality) analyticsCharts.nationality.destroy();
    analyticsCharts.nationality = new Chart(document.getElementById('nationalityChart'), {
        type: 'doughnut',
        data: { labels: ['سعودي', 'غير سعودي'], datasets: [{ data: [saudis, nonSaudis], backgroundColor: ['#4caf50', '#ff9800'] }] },
        options: { responsive: true }
    });
    
    // Salary Distribution
    const salaryRanges = { '< 5K': 0, '5-10K': 0, '10-15K': 0, '> 15K': 0 };
    employees.forEach(e => {
        const s = parseFloat(e.salary) || 0;
        if (s < 5000) salaryRanges['< 5K']++;
        else if (s < 10000) salaryRanges['5-10K']++;
        else if (s < 15000) salaryRanges['10-15K']++;
        else salaryRanges['> 15K']++;
    });
    if (analyticsCharts.salary) analyticsCharts.salary.destroy();
    analyticsCharts.salary = new Chart(document.getElementById('salaryChart'), {
        type: 'bar',
        data: { labels: Object.keys(salaryRanges), datasets: [{ label: 'عدد الموظفين', data: Object.values(salaryRanges), backgroundColor: '#667eea' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    
    // Leave Types - جلب البيانات الفعلية من API
    loadLeaveTypesChart();
}

async function loadLeaveTypesChart() {
    try {
        const token = localStorage.getItem('token');
        const API_URL = 'http://localhost:3000';
        
        // جلب جميع طلبات الإجازات من API
        const leavesRes = await fetch(`${API_URL}/admin/leaves`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!leavesRes.ok) {
            console.error('Error fetching leaves:', leavesRes.status);
            // في حالة عدم توفر البيانات، عرض رسم بياني فارغ
            if (analyticsCharts.leaveType) analyticsCharts.leaveType.destroy();
            analyticsCharts.leaveType = new Chart(document.getElementById('leaveTypeChart'), {
                type: 'bar',
                data: { 
                    labels: ['إجازة سنوية', 'إجازة مرضية', 'إجازة طارئة'], 
                    datasets: [{ 
                        label: 'الطلبات', 
                        data: [0, 0, 0], 
                        backgroundColor: ['#4caf50', '#ff9800', '#f44336'] 
                    }] 
                },
                options: { 
                    responsive: true, 
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { display: true }
                    }
                }
            });
            return;
        }
        
        const leaves = await leavesRes.json();
        
        // حساب عدد طلبات الإجازات حسب النوع من البيانات الفعلية
        const leaveTypeCounts = {
            'ANNUAL': 0,
            'SICK': 0,
            'EMERGENCY': 0
        };
        
        leaves.forEach(leave => {
            if (leaveTypeCounts.hasOwnProperty(leave.type)) {
                leaveTypeCounts[leave.type]++;
            }
        });
        
        // عرض البيانات في الرسم البياني
        if (analyticsCharts.leaveType) analyticsCharts.leaveType.destroy();
        analyticsCharts.leaveType = new Chart(document.getElementById('leaveTypeChart'), {
            type: 'bar',
            data: { 
                labels: ['إجازة سنوية', 'إجازة مرضية', 'إجازة طارئة'], 
                datasets: [{ 
                    label: 'الطلبات', 
                    data: [leaveTypeCounts.ANNUAL, leaveTypeCounts.SICK, leaveTypeCounts.EMERGENCY], 
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336'] 
                }] 
            },
            options: { 
                responsive: true, 
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'عدد الطلبات: ' + context.parsed.y;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading leave types chart:', error);
        // في حالة حدوث خطأ، عرض رسم بياني فارغ
        if (analyticsCharts.leaveType) analyticsCharts.leaveType.destroy();
        analyticsCharts.leaveType = new Chart(document.getElementById('leaveTypeChart'), {
            type: 'bar',
            data: { 
                labels: ['إجازة سنوية', 'إجازة مرضية', 'إجازة طارئة'], 
                datasets: [{ 
                    label: 'الطلبات', 
                    data: [0, 0, 0], 
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336'] 
                }] 
            },
            options: { 
                responsive: true, 
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function loadLeaveBalancesAnalytics() {
    const employees = analyticsData.employees;
    const today = new Date();
    
    // رسالة توضيحية عن قانون العمل السعودي
    const lawNote = `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #2196f3;">
            <h3 style="color: #1565c0; margin-bottom: 10px;">📋 حساب بدل الإجازة حسب قانون العمل السعودي</h3>
            <ul style="color: #1565c0; line-height: 1.8; margin-right: 20px;">
                <li><strong>المادة 2 - تعريف الأجر:</strong> الأجر = الأجر الفعلي = الأساسي + جميع البدلات المستحقة (سكن، نقل، إلخ)</li>
                <li><strong>المادة 109:</strong> الإجازة السنوية تُدفع بأجر كامل (الأجر الفعلي)</li>
                <li><strong>المادة 111:</strong> بدل الإجازة غير المستخدم يُحسب على الأجر الفعلي</li>
                <li><strong>شرط الاستحقاق:</strong> يجب إكمال سنة كاملة من تاريخ التعيين للحصول على بدل الإجازة</li>
                <li><strong>طريقة الحساب:</strong> الأجر اليومي = (الأساسي + السكن + النقل + البدلات) ÷ 30 يوم</li>
                <li><strong>بدل الإجازة:</strong> عدد أيام الإجازة × الأجر اليومي</li>
            </ul>
        </div>
    `;
    
    document.getElementById('leaveBalancesTable').innerHTML = lawNote + `<table class="analytics-table"><thead><tr><th>الموظف</th><th>القسم</th><th>الجنسية</th><th>تاريخ التعيين</th><th>مدة الخدمة</th><th>رصيد الإجازات</th><th>الأجر الفعلي</th><th>الأجر اليومي</th><th>بدل الإجازة</th><th>الحالة</th></tr></thead><tbody>${employees.map(e => {
        // حساب مدة الخدمة
        const hireDate = e.hireDate ? new Date(e.hireDate) : null;
        let monthsWorked = 0;
        let hasCompletedOneYear = false;
        
        if (hireDate) {
            const diffTime = today - hireDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            monthsWorked = Math.floor(diffDays / 30);
            hasCompletedOneYear = diffDays >= 365;
        }
        
        // حساب رصيد الإجازات حسب الجنسية ونوع العقد
        let balance = 30; // الافتراضي للسعوديين
        
        if (e.nationality === 'NON_SAUDI') {
            // للموظفين غير السعوديين: استخدام عدد أيام الإجازة من العقد
            balance = parseInt(e.contractLeaveDays) || 30;
        }
        
        // ✅ حساب الأجر الفعلي حسب قانون العمل السعودي (المادة 2)
        const basicSalary = parseFloat(e.basicSalary) || parseFloat(e.salary) || 0;
        const housingAllowance = parseFloat(e.housingAllowance) || 0;
        const transportAllowance = parseFloat(e.transportAllowance) || 0;
        const actualWage = basicSalary + housingAllowance + transportAllowance;
        
        // ✅ الأجر اليومي = الأجر الفعلي ÷ 30
        const dailyWage = actualWage / 30;
        
        // ✅ بدل الإجازة = عدد الأيام × الأجر اليومي (فقط إذا أكمل سنة)
        const leavePayValue = hasCompletedOneYear ? (balance * dailyWage) : 0;
        
        const nationalityLabel = e.nationality === 'SAUDI' ? 'سعودي' : 'غير سعودي';
        const hireDateStr = hireDate ? hireDate.toLocaleDateString('ar-SA') : 'غير محدد';
        const serviceYears = Math.floor(monthsWorked / 12);
        const serviceMonths = monthsWorked % 12;
        const serviceDuration = serviceYears > 0 ? `${serviceYears} سنة و ${serviceMonths} شهر` : `${serviceMonths} شهر`;
        
        // حالة الاستحقاق
        let statusHtml = '';
        if (!hireDate) {
            statusHtml = '<span style="color: #dc3545;">⚠️ تاريخ التعيين غير محدد</span>';
        } else if (!hasCompletedOneYear) {
            const remainingDays = 365 - Math.floor((today - hireDate) / (1000 * 60 * 60 * 24));
            statusHtml = `<span style="color: #ffc107;">⏳ متبقي ${remainingDays} يوم</span>`;
        } else {
            statusHtml = '<span style="color: #28a745;">✅ مستحق</span>';
        }
        
        return `<tr style="${!hasCompletedOneYear ? 'background: #fff3cd;' : ''}">
            <td><strong>${e.fullName}</strong></td>
            <td>${e.department || '-'}</td>
            <td>${nationalityLabel}</td>
            <td>${hireDateStr}</td>
            <td>${serviceDuration}</td>
            <td><strong style="color: #667eea;">${balance} يوم</strong></td>
            <td><strong style="color: #2e7d32;">${actualWage.toFixed(2)} ر.س</strong></td>
            <td>${dailyWage.toFixed(2)} ر.س</td>
            <td><strong style="color: ${hasCompletedOneYear ? '#1565c0' : '#999'}; font-size: 16px;">${hasCompletedOneYear ? leavePayValue.toFixed(2) + ' ر.س' : 'غير مستحق'}</strong></td>
            <td>${statusHtml}</td>
        </tr>`;
    }).join('')}</tbody></table>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-right: 4px solid #ffc107;">
        <p style="color: #856404; margin: 0;"><strong>💡 ملاحظة:</strong> بدل الإجازة يظهر فقط للموظفين الذين أكملوا سنة كاملة من تاريخ التعيين. الموظفون الجدد (أقل من سنة) يظهرون بخلفية صفراء.</p>
    </div>`;
}

function loadEndOfServiceAnalytics() {
    const employees = analyticsData.employees;
    const today = new Date();
    
    document.getElementById('endOfServiceTable').innerHTML = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-bottom: 10px;">📋 حساب المكافأة حسب قانون العمل السعودي (المادة 84)</h3>
            <ul style="color: #856404; line-height: 1.8; margin-right: 20px;">
                <li><strong>أول 5 سنوات:</strong> نصف شهر راتب عن كل سنة</li>
                <li><strong>بعد 5 سنوات:</strong> شهر راتب كامل عن كل سنة</li>
                <li><strong>في حالة الاستقالة:</strong>
                    <ul style="margin-right: 20px; margin-top: 5px;">
                        <li>أقل من سنتين: لا يستحق شيء</li>
                        <li>2-5 سنوات: يستحق ثلث المكافأة</li>
                        <li>5-10 سنوات: يستحق ثلثي المكافأة</li>
                        <li>أكثر من 10 سنوات: يستحق المكافأة كاملة</li>
                    </ul>
                </li>
            </ul>
        </div>
        
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>الموظف</th>
                    <th>الجنسية</th>
                    <th>تاريخ التعيين</th>
                    <th>مدة الخدمة (سنوات)</th>
                    <th>الأساسي</th>
                    <th>بدل السكن</th>
                    <th>بدل النقل</th>
                    <th>الأجر الفعلي</th>
                    <th>سبب الانتهاء</th>
                    <th>نسبة الاستحقاق</th>
                    <th>المكافأة المستحقة</th>
                </tr>
            </thead>
            <tbody>
                ${employees.map(emp => {
                    const hireDate = new Date(emp.hireDate);
                    const yearsOfService = (today - hireDate) / (1000 * 60 * 60 * 24 * 365);
                    
                    // ✅ حساب الأجر الفعلي حسب قانون العمل السعودي (المادة 2)
                    const basicSalary = parseFloat(emp.basicSalary) || parseFloat(emp.salary) || 0;
                    const housingAllowance = parseFloat(emp.housingAllowance) || 0;
                    const transportAllowance = parseFloat(emp.transportAllowance) || 0;
                    const actualWage = basicSalary + housingAllowance + transportAllowance;
                    
                    // حساب المكافأة الكاملة حسب القانون - باستخدام الأجر الفعلي
                    let fullReward = 0;
                    if (yearsOfService <= 5) {
                        // أول 5 سنوات: نصف شهر عن كل سنة
                        fullReward = actualWage * 0.5 * yearsOfService;
                    } else {
                        // أول 5 سنوات نصف شهر + الباقي شهر كامل
                        fullReward = (actualWage * 0.5 * 5) + (actualWage * 1 * (yearsOfService - 5));
                    }
                    
                    // تحديد سبب انتهاء الخدمة ونسبة الاستحقاق
                    // افتراضياً: انتهاء طبيعي (يمكن إضافة حقل terminationReason في قاعدة البيانات)
                    let terminationReason = emp.terminationReason || 'NORMAL_END'; // NORMAL_END, RESIGNATION, TERMINATION
                    let entitlementPercentage = 100;
                    let entitlementLabel = '100%';
                    let reasonLabel = 'انتهاء طبيعي';
                    
                    // حساب النسبة في حالة الاستقالة
                    if (terminationReason === 'RESIGNATION') {
                        reasonLabel = 'استقالة';
                        if (yearsOfService < 2) {
                            entitlementPercentage = 0;
                            entitlementLabel = '0% (أقل من سنتين)';
                        } else if (yearsOfService < 5) {
                            entitlementPercentage = 33.33;
                            entitlementLabel = '33.33% (ثلث المكافأة)';
                        } else if (yearsOfService < 10) {
                            entitlementPercentage = 66.67;
                            entitlementLabel = '66.67% (ثلثي المكافأة)';
                        } else {
                            entitlementPercentage = 100;
                            entitlementLabel = '100% (أكثر من 10 سنوات)';
                        }
                    } else if (terminationReason === 'TERMINATION') {
                        reasonLabel = 'إنهاء من صاحب العمل';
                        entitlementPercentage = 100;
                        entitlementLabel = '100%';
                    }
                    
                    // المكافأة النهائية المستحقة
                    const finalReward = fullReward * (entitlementPercentage / 100);
                    
                    // تحديد لون الصف حسب النسبة
                    let rowStyle = '';
                    if (entitlementPercentage === 0) {
                        rowStyle = 'background: #ffebee;';
                    } else if (entitlementPercentage < 100) {
                        rowStyle = 'background: #fff3e0;';
                    } else {
                        rowStyle = 'background: #e8f5e9;';
                    }
                    
                    const nationalityLabel = emp.nationality === 'SAUDI' ? 'سعودي' : 'غير سعودي';
                    
                    return `
                        <tr style="${rowStyle}">
                            <td><strong>${emp.fullName}</strong></td>
                            <td>${nationalityLabel}</td>
                            <td>${hireDate.toLocaleDateString('ar-SA')}</td>
                            <td>${yearsOfService.toFixed(2)} سنة</td>
                            <td>${basicSalary.toFixed(2)} ر.س</td>
                            <td>${housingAllowance.toFixed(2)} ر.س</td>
                            <td>${transportAllowance.toFixed(2)} ر.س</td>
                            <td><strong style="color: #2e7d32;">${actualWage.toFixed(2)} ر.س</strong></td>
                            <td><span class="badge ${terminationReason === 'RESIGNATION' ? 'badge-warning' : 'badge-success'}">${reasonLabel}</span></td>
                            <td><strong>${entitlementLabel}</strong></td>
                            <td><strong style="color: #2e7d32; font-size: 16px;">${finalReward.toFixed(2)} ر.س</strong></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px; border-right: 4px solid #2196f3;">
            <p style="color: #1565c0; margin: 0;"><strong>💡 ملاحظة:</strong> المكافأة محسوبة على الأجر الفعلي (الأساسي + البدلات) حسب المادة 2 من نظام العمل السعودي. هذا يضمن حصول الموظف على حقه الكامل عند إنهاء الخدمة.</p>
        </div>
    `;
}

function loadTicketsAnalytics() {
    const employees = analyticsData.employees.filter(e => e.ticketEntitlement === true || e.ticketEntitlement === 'true');
    document.getElementById('ticketsAnalysisTable').innerHTML = `<table class="analytics-table"><thead><tr><th>الموظف</th><th>الجنسية</th><th>الكفالة</th><th>الدرجة</th><th>الحالة</th></tr></thead><tbody>${employees.map(e => `
        <tr><td>${e.fullName}</td><td>${e.nationality === 'SAUDI' ? 'سعودي' : 'غير سعودي'}</td><td>${e.sponsorshipType === 'COMPANY' ? 'الشركة' : e.sponsorshipType === 'EXTERNAL' ? 'خارجية' : 'شخصية'}</td><td><span class="badge badge-info">${e.ticketClass === 'BUSINESS' ? 'أعمال' : 'سياحية'}</span></td><td><span class="badge badge-success">مستحق</span></td></tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">لا يوجد</td></tr>'}</tbody></table>`;
}

function loadDocumentsAlertsAnalytics() {
    const employees = analyticsData.employees;
    const today = new Date();
    const alerts = [];
    employees.forEach(e => {
        if (e.nationality !== 'NON_SAUDI') return;
        const check = (name, date) => {
            if (!date) return;
            const days = Math.floor((new Date(date) - today) / (1000 * 60 * 60 * 24));
            if (days <= 90) alerts.push({ 
                emp: e.fullName, 
                doc: name, 
                date: new Date(date).toLocaleDateString('ar-SA'), 
                days, 
                badge: days <= 0 ? 'badge-danger' : days <= 30 ? 'badge-warning' : 'badge-success' 
            });
        };
        check('جواز السفر', e.passportExpiryDate);
        check('رخصة العمل', e.workPermitExpiryDate);
        check('التأمين الطبي', e.medicalInsuranceExpiryDate);
    });
    alerts.sort((a, b) => a.days - b.days);
    document.getElementById('documentsAlertsTable').innerHTML = `<table class="analytics-table"><thead><tr><th>الموظف</th><th>الوثيقة</th><th>تاريخ الانتهاء</th><th>المتبقي</th><th>الحالة</th></tr></thead><tbody>${alerts.map(a => `
        <tr><td>${a.emp}</td><td>${a.doc}</td><td>${a.date}</td><td>${a.days > 0 ? a.days + ' يوم' : 'منتهي'}</td><td><span class="badge ${a.badge}">${a.days <= 0 ? 'منتهي' : a.days <= 30 ? 'عاجل' : 'تحذير'}</span></td></tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">لا توجد تنبيهات</td></tr>'}</tbody></table>`;
}

async function loadAssetsAnalytics() {
    try {
        const token = localStorage.getItem('token');
        const API_URL = 'http://localhost:3000';
        
        // جلب جميع العهد من API
        const assetsRes = await fetch(`${API_URL}/admin/assets`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!assetsRes.ok) {
            console.error('Error fetching assets:', assetsRes.status);
            document.getElementById('assetsAnalysisTable').innerHTML = '<div style="text-align:center;color:#999;padding:20px">لا توجد عهد عينية</div>';
            return;
        }
        
        const assets = await assetsRes.json();
        
        if (!assets || assets.length === 0) {
            document.getElementById('assetsAnalysisTable').innerHTML = '<div style="text-align:center;color:#999;padding:20px">لا توجد عهد عينية</div>';
            return;
        }
        
        // تجميع العهد حسب الموظف
        const employeeAssets = {};
        assets.forEach(asset => {
            if (!employeeAssets[asset.employeeId]) {
                employeeAssets[asset.employeeId] = {
                    active: [],
                    returned: []
                };
            }
            if (asset.returned) {
                employeeAssets[asset.employeeId].returned.push(asset);
            } else {
                employeeAssets[asset.employeeId].active.push(asset);
            }
        });
        
        // إنشاء جدول التحليل
        const employees = analyticsData.employees;
        const assetTypeNames = {
            'LAPTOP': 'لاب توب',
            'PHONE': 'هاتف',
            'TABLET': 'تابلت',
            'CAR': 'سيارة',
            'TOOLS': 'أدوات',
            'OTHER': 'أخرى'
        };
        
        // إحصائيات سريعة
        const totalAssets = assets.length;
        const activeAssets = assets.filter(a => !a.returned).length;
        const returnedAssets = assets.filter(a => a.returned).length;
        const employeesWithAssets = Object.keys(employeeAssets).length;
        
        // عرض الإحصائيات والجدول
        document.getElementById('assetsAnalysisTable').innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 36px; font-weight: bold;">${totalAssets}</div>
                    <div style="font-size: 14px; opacity: 0.9;">إجمالي العهد</div>
                </div>
                <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 36px; font-weight: bold;">${activeAssets}</div>
                    <div style="font-size: 14px; opacity: 0.9;">عهد نشطة</div>
                </div>
                <div style="background: linear-gradient(135deg, #17a2b8, #3498db); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 36px; font-weight: bold;">${returnedAssets}</div>
                    <div style="font-size: 14px; opacity: 0.9;">عهد مستردة</div>
                </div>
                <div style="background: linear-gradient(135deg, #ffc107, #ff9800); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 36px; font-weight: bold;">${employeesWithAssets}</div>
                    <div style="font-size: 14px; opacity: 0.9;">موظفون لديهم عهد</div>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-bottom: 10px;">📦 تحليل العهد العينية للموظفين</h3>
                <p style="color: #856404; margin: 0;">عرض جميع العهد المسلمة للموظفين والمستردة منهم</p>
            </div>
            
            <table class="analytics-table">
                <thead>
                    <tr>
                        <th>الموظف</th>
                        <th>القسم</th>
                        <th>الوظيفة</th>
                        <th>العهد النشطة</th>
                        <th>العهد المستردة</th>
                        <th>الإجمالي</th>
                        <th>التفاصيل</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(employeeAssets).map(employeeId => {
                        const emp = employees.find(e => e.id == employeeId);
                        if (!emp) return '';
                        
                        const empAssets = employeeAssets[employeeId];
                        const activeCount = empAssets.active.length;
                        const returnedCount = empAssets.returned.length;
                        const totalCount = activeCount + returnedCount;
                        
                        // قائمة العهد النشطة
                        const activeList = empAssets.active.map(a => 
                            `<span style="background: #d4edda; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">${assetTypeNames[a.assetType] || a.assetType}</span>`
                        ).join(' ');
                        
                        // قائمة العهد المستردة
                        const returnedList = empAssets.returned.map(a => 
                            `<span style="background: #d1ecf1; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">${assetTypeNames[a.assetType] || a.assetType}</span>`
                        ).join(' ');
                        
                        return `
                            <tr>
                                <td><strong>${emp.fullName}</strong></td>
                                <td>${emp.department || '-'}</td>
                                <td>${emp.jobTitle || '-'}</td>
                                <td style="text-align: center;"><span class="badge badge-success" style="font-size: 14px;">${activeCount}</span></td>
                                <td style="text-align: center;"><span class="badge" style="background: #d1ecf1; color: #0c5460; font-size: 14px;">${returnedCount}</span></td>
                                <td style="text-align: center;"><strong style="font-size: 16px; color: #667eea;">${totalCount}</strong></td>
                                <td>
                                    ${activeCount > 0 ? `<div style="margin-bottom: 5px;"><strong style="color: #28a745;">نشطة:</strong> ${activeList}</div>` : ''}
                                    ${returnedCount > 0 ? `<div><strong style="color: #17a2b8;">مستردة:</strong> ${returnedList}</div>` : ''}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px; border-right: 4px solid #2196f3;">
                <p style="color: #1565c0; margin: 0;"><strong>💡 ملاحظة:</strong> لإدارة العهد العينية (إضافة، تسليم، استرداد)، يمكنك الذهاب إلى صفحة <a href="assets.html" style="color: #1565c0; font-weight: bold;">📦 العهد العينية</a></p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading assets analytics:', error);
        document.getElementById('assetsAnalysisTable').innerHTML = '<div style="text-align:center;color:#f44336;padding:20px">حدث خطأ أثناء تحميل تحليل العهد</div>';
    }
}
