// ============================================
// MAIN APP LOGIC & ROUTING
// ============================================

import { APP_STATE, CORE_MODULES, AVAILABLE_APPS } from './config.js';
import { showToast } from './utils.js';
import { handleLogin, completeLogin, handleLogout } from './auth.js';
import { getDashboardContent } from './modules/dashboard.js';

// Expose APP_STATE globally for debugging
window.APP_STATE = APP_STATE;

let MODULES = JSON.parse(JSON.stringify(CORE_MODULES));

// ============================================
// INITIALIZATION
// ============================================

export function initApp() {
  attachEventListeners();
  initSplashScreen();
  setupPages();
  lucide.createIcons();
}

function attachEventListeners() {
  // Login page
  const loginBtn = document.getElementById('btn-login');
  const passwordInput = document.getElementById('login-password');
  const continueBtn = document.getElementById('btn-continue');
  const logoutBtn = document.getElementById('btn-logout');
  
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (passwordInput) passwordInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin(e);
  });
  if (continueBtn) continueBtn.addEventListener('click', completeLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}

// ============================================
// SPLASH SCREEN LOGIC
// ============================================

window.currentSlide = 1;
window.totalSlides = 3;

function initSplashScreen() {
  const prevBtn = document.getElementById('btn-splash-prev');
  const nextBtn = document.getElementById('btn-splash-next');
  const skipBtn = document.getElementById('btn-splash-skip');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (window.currentSlide > 1) {
        window.currentSlide--;
        updateSplashSlide();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (window.currentSlide < window.totalSlides) {
        window.currentSlide++;
        updateSplashSlide();
      } else {
        goToLandingPage();
      }
    });
  }

  if (skipBtn) skipBtn.addEventListener('click', goToLandingPage);

  updateSplashSlide();
}

function updateSplashSlide() {
  // Hide all slides
  for (let i = 1; i <= window.totalSlides; i++) {
    const slide = document.getElementById(`slide-${i}`);
    const dot = document.getElementById(`dot-${i}`);
    if (slide) slide.classList.add('hidden');
    if (dot) {
      dot.classList.remove('w-2.5', 'h-2.5');
      dot.classList.add('w-2', 'h-2', 'bg-opacity-40');
    }
  }

  // Show current slide
  const currentSlideEl = document.getElementById(`slide-${window.currentSlide}`);
  const currentDot = document.getElementById(`dot-${window.currentSlide}`);
  if (currentSlideEl) currentSlideEl.classList.remove('hidden');
  if (currentDot) {
    currentDot.classList.add('w-2.5', 'h-2.5');
    currentDot.classList.remove('w-2', 'h-2', 'bg-opacity-40');
  }

  // Update button state
  const prevBtn = document.getElementById('btn-splash-prev');
  if (prevBtn) {
    prevBtn.disabled = window.currentSlide === 1;
    prevBtn.style.opacity = window.currentSlide === 1 ? '0.5' : '1';
  }
}

function setupPages() {
  const loginBtn = document.getElementById('btn-landing-login');
  const getStartedBtn = document.getElementById('btn-hero-getstarted');
  const ctaBtn = document.getElementById('btn-cta-login');

  if (loginBtn) loginBtn.addEventListener('click', goToLoginPage);
  if (getStartedBtn) getStartedBtn.addEventListener('click', goToLoginPage);
  if (ctaBtn) ctaBtn.addEventListener('click', goToLoginPage);
}

function goToLandingPage() {
  document.getElementById('splash-screen').classList.add('hidden');
  document.getElementById('landing-page').classList.remove('hidden');
  lucide.createIcons();
}

function goToLoginPage() {
  document.getElementById('splash-screen').classList.add('hidden');
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  lucide.createIcons();
}

// ============================================
// MAIN APP INITIALIZATION
// ============================================

export function initMainApp() {
  // Update header info
  document.getElementById('school-name-display').textContent = APP_STATE.currentSchool.school_name;
  document.getElementById('user-role-badge').textContent = APP_STATE.currentRole.toUpperCase();
  document.getElementById('user-name-display').textContent = APP_STATE.currentUser.name;
  document.getElementById('user-email-display').textContent = APP_STATE.currentUser.email;

  // Load installed apps
  loadUserInstalledApps();

  // Render sidebar and navigate to dashboard
  renderSidebar();
  navigateTo('dashboard');
}

// ============================================
// APP MANAGEMENT
// ============================================

function loadUserInstalledApps() {
  const key = `apps_${APP_STATE.currentSchool.code}_${APP_STATE.currentUser.username}`;
  const installed = localStorage.getItem(key);
  APP_STATE.userInstalledApps = installed ? JSON.parse(installed) : [];
  updateSidebarWithInstalledApps();
}

function updateSidebarWithInstalledApps() {
  const roleModules = CORE_MODULES[APP_STATE.currentRole] || CORE_MODULES.admin;
  MODULES[APP_STATE.currentRole] = JSON.parse(JSON.stringify(roleModules));

  const settingsIndex = MODULES[APP_STATE.currentRole].findIndex(m => m.id === 'settings');
  const insertIndex = settingsIndex !== -1 ? settingsIndex : MODULES[APP_STATE.currentRole].length;

  APP_STATE.userInstalledApps.forEach((app, idx) => {
    const appModule = AVAILABLE_APPS.find(a => a.id === app.app_id);
    if (appModule) {
      MODULES[APP_STATE.currentRole].splice(insertIndex + idx, 0, {
        id: `app_${app.app_id}`,
        icon: 'grid',
        label: appModule.name,
        isApp: true
      });
    }
  });
}

export function handleAppAction(appId, isInstalled) {
  if (isInstalled) {
    APP_STATE.userInstalledApps = APP_STATE.userInstalledApps.filter(a => a.app_id !== appId);
    showToast('แอปถูกลบออกแล้ว', 'success');
  } else {
    const app = AVAILABLE_APPS.find(a => a.id === appId);
    if (APP_STATE.userInstalledApps.length >= 10) {
      showToast('ติดตั้งแอปได้สูงสุด 10 รายการ', 'error');
      return;
    }

    APP_STATE.userInstalledApps.push({
      app_id: appId,
      app_name: app.name,
      installed_at: new Date().toISOString(),
      enabled: true
    });
    showToast(`${app.name} ติดตั้งแล้ว!`, 'success');
  }

  const key = `apps_${APP_STATE.currentSchool.code}_${APP_STATE.currentUser.username}`;
  localStorage.setItem(key, JSON.stringify(APP_STATE.userInstalledApps));
  navigateTo('app-store');
  updateSidebarWithInstalledApps();
  renderSidebar();
}

export function toggleAppGlobal(appId, isEnabled) {
  const enabledAppsKey = `apps_enabled_${APP_STATE.currentSchool.code}`;
  let enabledApps = JSON.parse(localStorage.getItem(enabledAppsKey) || '[]');

  if (isEnabled) {
    if (!enabledApps.includes(appId)) {
      enabledApps.push(appId);
    }
    showToast('เปิดใช้งานแอปแล้ว', 'success');
  } else {
    enabledApps = enabledApps.filter(id => id !== appId);
    showToast('ปิดใช้งานแอปแล้ว', 'success');
  }

  localStorage.setItem(enabledAppsKey, JSON.stringify(enabledApps));
  navigateTo('app-management');
}

// ============================================
// SIDEBAR & NAVIGATION
// ============================================

export function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const modules = MODULES[APP_STATE.currentRole] || MODULES.admin;

  nav.innerHTML = modules.map(m => `
    <button class="sidebar-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 font-medium ${APP_STATE.currentModule === m.id ? 'active' : ''}" data-module="${m.id}">
      <i data-lucide="${m.icon}" class="w-[18px] h-[18px]"></i>
      <span>${m.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.module));
  });

  lucide.createIcons();
}

export function navigateTo(moduleId) {
  APP_STATE.currentModule = moduleId;
  renderSidebar();

  const content = document.getElementById('page-content');
  const titleEl = document.getElementById('page-title');
  const breadcrumb = document.getElementById('page-breadcrumb');

  const mod = (MODULES[APP_STATE.currentRole] || MODULES.admin).find(m => m.id === moduleId);
  titleEl.textContent = mod ? mod.label : 'Dashboard';
  breadcrumb.textContent = `${APP_STATE.currentSchool.school_name} • ${APP_STATE.currentRole}`;

  content.innerHTML = `<div class="fade-in">${getModuleContent(moduleId)}</div>`;
  lucide.createIcons();
}

// ============================================
// MODULE CONTENT ROUTING
// ============================================

function getModuleContent(moduleId) {
  switch (moduleId) {
    case 'dashboard':
      return getDashboardContent(APP_STATE.currentRole);
    case 'students':
      return getStudentsContent();
    case 'teachers':
      return getTeachersContent();
    case 'academic':
      return getAcademicContent();
    case 'finance':
      return getFinanceContent();
    case 'reports':
      return getReportsContent();
    case 'app-management':
      return getAppManagementContent();
    case 'app-store':
      return getAppStoreContent();
    case 'settings':
      return getSettingsContent();
    default:
      return getGenericModule(moduleId);
  }
}

// ============================================
// MODULE CONTENT FUNCTIONS (BASIC TEMPLATES)
// ============================================

function getStudentsContent() {
  return `
    <div class="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-50">
          <tr>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">นักเรียน</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">ชั้นเรียน</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">GPA</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">สถานะ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          ${[
            { name: 'Emma Wilson', id: 'STU001', grade: '10-A', gpa: '3.9', status: 'Active' },
            { name: 'Liam Parker', id: 'STU002', grade: '10-B', gpa: '3.7', status: 'Active' },
            { name: 'Aisha Rahman', id: 'STU003', grade: '9-A', gpa: '3.85', status: 'Active' }
          ].map(s => `
            <tr class="hover:bg-surface-50 transition">
              <td class="px-5 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">${s.name[0]}</div><span class="text-sm font-medium text-gray-800">${s.name}</span></div></td>
              <td class="px-5 py-4 text-sm text-gray-600">${s.grade}</td>
              <td class="px-5 py-4 text-sm font-semibold text-gray-800">${s.gpa}</td>
              <td class="px-5 py-4"><span class="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">${s.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getTeachersContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${[
        { name: 'Michael Chen', subject: 'Mathematics', classes: 5, students: 164 },
        { name: 'Patricia Gomez', subject: 'English', classes: 4, students: 132 },
        { name: 'Ahmed Hassan', subject: 'Physics', classes: 3, students: 96 }
      ].map(t => `
        <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-bold">${t.name[0]}</div>
            <div><p class="text-sm font-semibold text-gray-800">${t.name}</p><p class="text-xs text-gray-500">${t.subject}</p></div>
          </div>
          <div class="flex justify-between text-center border-t border-surface-100 pt-3">
            <div><p class="text-lg font-bold text-gray-800">${t.classes}</p><p class="text-[10px] text-gray-400">Classes</p></div>
            <div><p class="text-lg font-bold text-gray-800">${t.students}</p><p class="text-[10px] text-gray-400">Students</p></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getAcademicContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
        <div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><i data-lucide="calendar" class="w-5 h-5 text-blue-600"></i></div><span class="text-sm font-semibold text-gray-700">ปีการศึกษา</span></div>
        <p class="text-xl font-bold text-gray-800">2024-2025</p><p class="text-xs text-gray-500">Semester 2</p>
      </div>
      <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
        <div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><i data-lucide="book-open" class="w-5 h-5 text-emerald-600"></i></div><span class="text-sm font-semibold text-gray-700">วิชา</span></div>
        <p class="text-xl font-bold text-gray-800">32</p><p class="text-xs text-gray-500">ทั้งหมด</p>
      </div>
      <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
        <div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center"><i data-lucide="layout-grid" class="w-5 h-5 text-violet-600"></i></div><span class="text-sm font-semibold text-gray-700">ชั้นเรียน</span></div>
        <p class="text-xl font-bold text-gray-800">48</p><p class="text-xs text-gray-500">ชั้นที่ใช้งาน</p>
      </div>
    </div>
  `;
}

function getFinanceContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg"><p class="text-sm opacity-80">รายได้ทั้งสิ้น</p><p class="text-2xl font-bold mt-1">$1,420,000</p></div>
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg"><p class="text-sm opacity-80">ได้รับแล้ว</p><p class="text-2xl font-bold mt-1">$1,180,000</p></div>
      <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg"><p class="text-sm opacity-80">ยังค้างอยู่</p><p class="text-2xl font-bold mt-1">$240,000</p></div>
    </div>
  `;
}

function getReportsContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${[
        { title: 'Enrollment Report', icon: 'users', color: 'bg-blue-50 text-blue-600' },
        { title: 'Attendance Report', icon: 'check-circle', color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Financial Report', icon: 'wallet', color: 'bg-amber-50 text-amber-600' },
        { title: 'Academic Performance', icon: 'award', color: 'bg-violet-50 text-violet-600' }
      ].map(r => `
        <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
          <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 ${r.color} rounded-xl flex items-center justify-center"><i data-lucide="${r.icon}" class="w-5 h-5"></i></div><h4 class="text-sm font-semibold text-gray-800">${r.title}</h4></div>
          <button class="text-xs font-medium text-brand-600 flex items-center gap-1"><i data-lucide="download" class="w-3 h-3"></i> Generate</button>
        </div>
      `).join('')}
    </div>
  `;
}

function getAppManagementContent() {
  const enabledAppsKey = `apps_enabled_${APP_STATE.currentSchool.code}`;
  const enabledApps = JSON.parse(localStorage.getItem(enabledAppsKey) || '[]');

  return `
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-1">จัดการแอป</h2>
      <p class="text-sm text-gray-500">เปิด/ปิดใช้งานแอปสำหรับผู้ใช้ทั้งหมด</p>
    </div>
    <div class="space-y-3">
      ${AVAILABLE_APPS.map(app => {
        const isEnabled = enabledApps.includes(app.id);
        return `
          <div class="bg-white rounded-2xl border border-surface-200 p-5 flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1">
              <div class="text-3xl">${app.icon}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-gray-800">${app.name}</h3>
                  <span class="text-xs font-medium bg-surface-100 text-gray-600 px-2 py-0.5 rounded-full">${app.category}</span>
                  ${isEnabled ? `<span class="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">เปิดใช้งาน</span>` : ''}
                </div>
                <p class="text-sm text-gray-600">${app.description}</p>
              </div>
            </div>
            <label class="flex items-center gap-3 ml-4 cursor-pointer">
              <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="window.toggleAppGlobal('${app.id}', this.checked)" class="w-5 h-5 rounded accent-brand-600">
            </label>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getAppStoreContent() {
  const installedApps = APP_STATE.userInstalledApps || [];
  const enabledAppsKey = `apps_enabled_${APP_STATE.currentSchool.code}`;
  const enabledApps = JSON.parse(localStorage.getItem(enabledAppsKey) || '[]');
  const availableForRole = AVAILABLE_APPS.filter(app => 
    app.permissions[APP_STATE.currentRole] && 
    Object.values(app.permissions[APP_STATE.currentRole]).some(v => v) && 
    enabledApps.includes(app.id)
  );

  return `
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-1">ร้านแอป</h2>
      <p class="text-sm text-gray-500">ค้นหาและติดตั้งแอปสำหรับ ${APP_STATE.currentRole}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${availableForRole.map(app => {
        const isInstalled = installedApps.some(ia => ia.app_id === app.id);
        return `
          <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover flex flex-col">
            <div class="flex items-start justify-between mb-3">
              <div class="text-4xl">${app.icon}</div>
              ${isInstalled ? `<span class="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">✓ ติดตั้งแล้ว</span>` : `<span class="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">พร้อมใช้</span>`}
            </div>
            <h3 class="font-semibold text-gray-800 mb-1">${app.name}</h3>
            <p class="text-xs text-gray-400 mb-2">${app.category}</p>
            <p class="text-sm text-gray-600 mb-3 flex-1">${app.description}</p>
            <button class="px-4 py-2 rounded-lg font-medium text-sm ${isInstalled ? 'bg-surface-100 hover:bg-surface-200 text-gray-800' : 'bg-brand-600 hover:bg-brand-700 text-white'} transition" onclick="window.handleAppAction('${app.id}', ${isInstalled}, event)">
              ${isInstalled ? 'ลบ' : 'ติดตั้ง'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getSettingsContent() {
  return `
    <div class="max-w-2xl">
      <div class="bg-white rounded-2xl border border-surface-200 p-6">
        <h3 class="font-semibold text-gray-800 mb-4">การตั้งค่าโรงเรียน</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">ชื่อโรงเรียน</label>
            <input type="text" value="${APP_STATE.currentSchool.school_name}" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
          </div>
          <button class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition">บันทึกการเปลี่ยนแปลง</button>
        </div>
      </div>
    </div>
  `;
}

function getGenericModule(id) {
  const title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `
    <div class="bg-white rounded-2xl border border-surface-200 p-8 text-center">
      <div class="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><i data-lucide="construction" class="w-8 h-8 text-gray-400"></i></div>
      <h3 class="text-lg font-semibold text-gray-700">${title}</h3>
      <p class="text-sm text-gray-500 mt-2">โมดูลนี้กำลังอยู่ในการพัฒนา</p>
    </div>
  `;
}

// Make global functions available
window.handleAppAction = handleAppAction;
window.toggleAppGlobal = toggleAppGlobal;
