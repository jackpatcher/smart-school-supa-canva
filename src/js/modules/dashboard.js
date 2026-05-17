// ============================================
// DASHBOARD MODULE
// ============================================

import { createStatCard, createButton } from '../components.js';

export function getDashboardContent(role = 'admin') {
  if (role === 'admin') return getAdminDashboard();
  if (role === 'teacher') return getTeacherDashboard();
  if (role === 'student') return getStudentDashboard();
  if (role === 'parent') return getParentDashboard();
  if (role === 'executive') return getExecutiveDashboard();
  
  return getAdminDashboard();
}

function getAdminDashboard() {
  const stats = [
    { label: 'นักเรียนทั้งหมด', value: '1,247', icon: 'users', color: 'blue', change: '+12%' },
    { label: 'ครูทั้งหมด', value: '86', icon: 'briefcase', color: 'emerald', change: '+3' },
    { label: 'การเข้าเรียนวันนี้', value: '94.2%', icon: 'check-circle', color: 'violet', change: '+1.2%' },
    { label: 'รายได้เดือนนี้', value: '$142K', icon: 'wallet', color: 'amber', change: '+8%' }
  ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${stats.map(s => createStatCard(s)).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i data-lucide="activity" class="w-4 h-4 text-brand-500"></i> กิจกรรมล่าสุด
        </h3>
        <div class="space-y-3">
          ${getRecentActivities().join('')}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i> การกระทำด่วน
        </h3>
        <div class="space-y-2">
          ${getQuickActions().join('')}
        </div>
      </div>
    </div>
  `;
}

function getTeacherDashboard() {
  const stats = [
    { label: 'ชั้นเรียนของฉัน', value: '5', icon: 'book-open', color: 'blue', change: '' },
    { label: 'นักเรียน', value: '164', icon: 'users', color: 'emerald', change: '' },
    { label: 'การให้คะแนนที่รอ', value: '23', icon: 'file-text', color: 'amber', change: 'Due Fri' },
    { label: 'การเข้าเรียน', value: '96%', icon: 'check-circle', color: 'violet', change: '' }
  ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${stats.map(s => createStatCard(s)).join('')}
    </div>

    <div class="bg-white rounded-2xl border border-surface-200 p-5">
      <h3 class="font-semibold text-gray-800 mb-4">ตารางเรียนวันนี้</h3>
      <div class="space-y-2">
        ${[
          { time: '08:00 - 08:45', subject: 'คณิตศาสตร์', room: 'ห้อง 201', color: 'bg-blue-100 text-blue-700' },
          { time: '09:00 - 09:45', subject: 'ภาษาอังกฤษ', room: 'ห้อง 105', color: 'bg-emerald-100 text-emerald-700' },
          { time: '10:00 - 10:45', subject: 'ฟิสิกส์', room: 'ปฏิบัติการ 3', color: 'bg-violet-100 text-violet-700' }
        ].map(c => `
          <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition">
            <span class="text-xs font-mono text-gray-500 w-28 shrink-0">${c.time}</span>
            <span class="text-xs font-semibold ${c.color} px-2.5 py-1 rounded-lg">${c.subject}</span>
            <span class="text-xs text-gray-400 flex-1">${c.room}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getStudentDashboard() {
  const stats = [
    { label: 'เกรดเฉลี่ย', value: '3.82', icon: 'award', color: 'blue', change: '+0.1' },
    { label: 'การเข้าเรียน', value: '97%', icon: 'check-circle', color: 'emerald', change: '' },
    { label: 'คอร์สของฉัน', value: '6', icon: 'book-open', color: 'violet', change: '' },
    { label: 'งานที่มอบหมาย', value: '3', icon: 'file-text', color: 'amber', change: 'Due soon' }
  ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${stats.map(s => createStatCard(s)).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4">งานที่มอบหมายล่าสุด</h3>
        <div class="space-y-2">
          ${[
            { subject: 'คณิตศาสตร์', title: 'Chapter 5 Exercises', dueDate: 'Jan 15' },
            { subject: 'ภาษาไทย', title: 'Short Story Writing', dueDate: 'Jan 18' },
            { subject: 'วิทยาศาสตร์', title: 'Lab Report', dueDate: 'Jan 16' }
          ].map(a => `
            <div class="p-3 rounded-lg border border-surface-100 hover:border-brand-200 transition">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-medium text-brand-600">${a.subject}</p>
                  <p class="text-sm font-semibold text-gray-800">${a.title}</p>
                </div>
                <span class="text-xs text-amber-600">ครบกำหนด: ${a.dueDate}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4">การประกาศล่าสุด</h3>
        <div class="space-y-3">
          ${[
            { title: 'Sports Day Registration', date: 'Jan 10' },
            { title: 'Semester 2 Grades Released', date: 'Jan 9' },
            { title: 'School Closed - Holiday', date: 'Jan 8' }
          ].map(n => `
            <div class="p-3 rounded-lg border-l-4 border-brand-500 bg-brand-50">
              <p class="text-sm font-semibold text-gray-800">${n.title}</p>
              <p class="text-xs text-gray-400 mt-1">${n.date}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function getParentDashboard() {
  return `
    <div class="bg-white rounded-2xl border border-surface-200 p-5 mb-4">
      <h2 class="text-lg font-bold text-gray-800 mb-4">สารสนเทศเกี่ยวกับลูก</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-surface-50 rounded-lg p-4">
          <p class="text-xs text-gray-500">การเข้าเรียน</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">97%</p>
        </div>
        <div class="bg-surface-50 rounded-lg p-4">
          <p class="text-xs text-gray-500">เกรดเฉลี่ย</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">3.82</p>
        </div>
        <div class="bg-surface-50 rounded-lg p-4">
          <p class="text-xs text-gray-500">สถานะอื่นๆ</p>
          <p class="text-2xl font-bold text-green-600 mt-1">✓ ดีเยี่ยม</p>
        </div>
      </div>
    </div>
  `;
}

function getExecutiveDashboard() {
  const stats = [
    { label: 'จำนวนนักเรียน', value: '1,247', icon: 'users', color: 'blue', change: '+5%' },
    { label: 'รายได้ทั้งสิ้น', value: '$1.2M', icon: 'wallet', color: 'emerald', change: '+12%' },
    { label: 'อัตราเข้าเรียน', value: '94.2%', icon: 'percent', color: 'violet', change: '' },
    { label: 'คณะครู', value: '86', icon: 'briefcase', color: 'amber', change: '+3' }
  ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${stats.map(s => createStatCard(s)).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4">รายได้รายเดือน</h3>
        <div class="h-48 bg-gradient-to-b from-brand-50 to-surface-50 rounded-lg flex items-center justify-center text-gray-400">
          [Chart placeholder]
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-surface-200 p-5">
        <h3 class="font-semibold text-gray-800 mb-4">สถิติหลักในปีนี้</h3>
        <div class="space-y-3">
          ${[
            { label: 'เรียนรู้ใหม่', value: '156 นักเรียน' },
            { label: 'อัตราคงค้าง', value: '2.3%' },
            { label: 'ความพึงพอใจ', value: '4.7/5.0' }
          ].map(s => `
            <div class="flex justify-between items-center p-2 border-b border-surface-100">
              <span class="text-sm text-gray-600">${s.label}</span>
              <span class="font-semibold text-gray-800">${s.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function getRecentActivities() {
  return [
    { text: 'นักเรียนใหม่ลงทะเบียน: Aisha Rahman', time: '2 นาทีที่แล้ว', dot: 'bg-green-400' },
    { text: 'ส่งรายงานเกรดแล้ว', time: '15 นาทีที่แล้ว', dot: 'bg-blue-400' },
    { text: 'ได้รับชำระเงิน: $2,400', time: '1 ชั่วโมงที่แล้ว', dot: 'bg-amber-400' },
    { text: 'ทำเครื่องหมายการเข้าเรียนแล้ว', time: '2 ชั่วโมงที่แล้ว', dot: 'bg-violet-400' },
    { text: 'ประกาศใหม่: วันกีฬา', time: '3 ชั่วโมงที่แล้ว', dot: 'bg-pink-400' }
  ].map(a => `
    <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition">
      <span class="w-2 h-2 ${a.dot} rounded-full shrink-0"></span>
      <p class="text-sm text-gray-700 flex-1">${a.text}</p>
      <span class="text-[10px] text-gray-400 shrink-0">${a.time}</span>
    </div>
  `);
}

function getQuickActions() {
  return [
    { label: 'เพิ่มนักเรียน', icon: 'user-plus', color: 'bg-blue-50 text-blue-600' },
    { label: 'ทำเครื่องหมายการเข้าเรียน', icon: 'check-square', color: 'bg-green-50 text-green-600' },
    { label: 'ส่งการแจ้งเตือน', icon: 'send', color: 'bg-violet-50 text-violet-600' },
    { label: 'สร้างรายงาน', icon: 'file-text', color: 'bg-amber-50 text-amber-600' },
    { label: 'บันทึกการชำระเงิน', icon: 'credit-card', color: 'bg-pink-50 text-pink-600' }
  ].map(a => `
    <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition text-left">
      <div class="w-9 h-9 ${a.color} rounded-lg flex items-center justify-center">
        <i data-lucide="${a.icon}" class="w-4 h-4"></i>
      </div>
      <span class="text-sm font-medium text-gray-700">${a.label}</span>
    </button>
  `);
}
