import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class NotificationsService {
  private db = InMemoryDatabase.getInstance();

  // إنشاء إشعار
  createNotification(userId: number, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO', link?: string) {
    return this.db.createNotification({
      userId,
      title,
      message,
      type,
      link,
    });
  }

  // الحصول على إشعارات المستخدم
  getUserNotifications(userId: number) {
    return this.db.getNotificationsByUserId(userId);
  }

  // الحصول على الإشعارات غير المقروءة
  getUnreadNotifications(userId: number) {
    return this.db.getUnreadNotificationsByUserId(userId);
  }

  // عدد الإشعارات غير المقروءة
  getUnreadCount(userId: number): number {
    return this.db.getUnreadNotificationsByUserId(userId).length;
  }

  // تحديد إشعار كمقروء
  markAsRead(notificationId: number) {
    return this.db.markNotificationAsRead(notificationId);
  }

  // تحديد جميع الإشعارات كمقروءة
  markAllAsRead(userId: number) {
    return this.db.markAllNotificationsAsRead(userId);
  }

  // حذف إشعار
  deleteNotification(notificationId: number) {
    return this.db.deleteNotification(notificationId);
  }

  // إشعارات النظام التلقائية
  
  // إشعار بموافقة على طلب إجازة
  notifyLeaveApproval(employeeId: number, leaveDays: number) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      this.createNotification(
        user.id,
        'تمت الموافقة على طلب الإجازة',
        `تمت الموافقة على طلب إجازتك لمدة ${leaveDays} يوم`,
        'SUCCESS',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار برفض طلب إجازة
  notifyLeaveRejection(employeeId: number) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      this.createNotification(
        user.id,
        'تم رفض طلب الإجازة',
        'تم رفض طلب إجازتك. يرجى التواصل مع المدير',
        'ERROR',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار بموافقة على سلفة
  notifyAdvanceApproval(employeeId: number, amount: number) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      this.createNotification(
        user.id,
        'تمت الموافقة على السلفة',
        `تمت الموافقة على سلفة بقيمة ${amount} ريال`,
        'SUCCESS',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار برفض سلفة
  notifyAdvanceRejection(employeeId: number) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      this.createNotification(
        user.id,
        'تم رفض السلفة',
        'تم رفض طلب السلفة. يرجى التواصل مع المدير',
        'ERROR',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار بتعيين عهدة جديدة
  notifyNewAsset(employeeId: number, assetType: string) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      this.createNotification(
        user.id,
        'عهدة جديدة',
        `تم تعيين عهدة جديدة لك: ${assetType}. يرجى تأكيد الاستلام`,
        'WARNING',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار بانتهاء صلاحية وثيقة
  notifyDocumentExpiry(employeeId: number, documentType: string, expiryDate: Date) {
    const user = this.db.users.find(u => u.employeeId === employeeId);
    if (user) {
      const formattedDate = new Date(expiryDate).toLocaleDateString('ar-SA');
      this.createNotification(
        user.id,
        'تنبيه: انتهاء صلاحية وثيقة',
        `وثيقة ${documentType} ستنتهي صلاحيتها في ${formattedDate}`,
        'WARNING',
        '/employee-dashboard.html'
      );
    }
  }

  // إشعار لجميع الموظفين
  notifyAllEmployees(title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') {
    const users = this.db.users.filter(u => u.role === 'EMPLOYEE');
    users.forEach(user => {
      this.createNotification(user.id, title, message, type);
    });
  }
}
