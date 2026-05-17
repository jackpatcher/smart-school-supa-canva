// ============================================
// AUTHENTICATION SYSTEM
// ============================================

import { APP_STATE, DEMO_USERS } from './config.js';
import { showToast, parseError } from './utils.js';

let supabaseClient = null;

export function setSupabaseClient(client) {
  supabaseClient = client;
}

export function handleLogin(e) {
  e.preventDefault();
  
  const schoolCode = document.getElementById('login-school').value.trim().toUpperCase();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  
  errorEl.classList.add('hidden');

  // Validation
  if (!schoolCode || !username || !password) {
    errorEl.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    errorEl.classList.remove('hidden');
    return;
  }

  // Find school
  const school = DEMO_USERS[schoolCode];
  if (!school) {
    errorEl.textContent = 'ไม่พบรหัสโรงเรียน ลองใช้ SCH001 หรือ SCH002';
    errorEl.classList.remove('hidden');
    return;
  }

  // Find user
  const user = school.users[username];
  if (!user || user.password !== password) {
    errorEl.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    errorEl.classList.remove('hidden');
    return;
  }

  // Update app state
  APP_STATE.currentUser = { username, school_code: schoolCode, ...user };
  APP_STATE.currentSchool = { code: schoolCode, ...school };
  APP_STATE.currentRole = user.role;

  // Show step 2
  document.getElementById('login-step-1').classList.add('hidden');
  document.getElementById('login-step-2').classList.remove('hidden');
}

export function completeLogin() {
  APP_STATE.isAuthenticated = true;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('main-app').classList.add('flex');
  
  showToast(`ยินดีต้อนรับ, ${APP_STATE.currentUser.name}!`, 'success');
  
  // Initialize main app to render dashboard and sidebar
  window.initMainApp();
}

export function handleLogout() {
  APP_STATE.isAuthenticated = false;
  APP_STATE.currentUser = null;
  APP_STATE.allUsers = [];
  
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('main-app').classList.remove('flex');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-step-1').classList.remove('hidden');
  document.getElementById('login-step-2').classList.add('hidden');
  document.getElementById('login-password').value = '';
}

export async function authenticateWithSupabase(schoolCode, username, password) {
  if (!supabaseClient) return false;

  const errorEl = document.getElementById('login-error');
  
  try {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('school_code', schoolCode)
      .eq('username', username)
      .eq('status', 'active')
      .single();

    if (error || !users) {
      errorEl.textContent = 'ไม่พบผู้ใช้หรือบัญชีไม่ใช้งาน';
      errorEl.classList.remove('hidden');
      return false;
    }

    APP_STATE.currentUser = { username, school_code: schoolCode, ...users };
    APP_STATE.currentSchool = { code: schoolCode, school_name: 'School from DB' };
    APP_STATE.currentRole = users.role;

    document.getElementById('login-step-1').classList.add('hidden');
    document.getElementById('login-step-2').classList.remove('hidden');
    return true;
  } catch (error) {
    errorEl.textContent = 'Authentication error: ' + parseError(error);
    errorEl.classList.remove('hidden');
    return false;
  }
}

export function isAuthenticated() {
  return APP_STATE.isAuthenticated;
}

export function getCurrentUser() {
  return APP_STATE.currentUser;
}

export function getCurrentRole() {
  return APP_STATE.currentRole;
}

export function getCurrentSchool() {
  return APP_STATE.currentSchool;
}

export function canAccess(requiredRole) {
  if (!APP_STATE.isAuthenticated) return false;
  if (APP_STATE.currentRole === 'admin') return true;
  return APP_STATE.currentRole === requiredRole;
}
