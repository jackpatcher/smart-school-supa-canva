// ============================================
// UTILITY FUNCTIONS
// ============================================

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-brand-600' };
  const icons = { success: 'check-circle', error: 'alert-circle', info: 'info' };
  
  const toast = document.createElement('div');
  toast.className = `${colors[type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium fade-in`;
  toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-4 h-4"></i><span>${message}</span>`;
  container.appendChild(toast);
  
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount);
}

export function truncate(text, length = 50) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function parseError(error) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An error occurred';
}

export function getColorMap() {
  return {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    pink: 'from-pink-500 to-pink-600',
    rose: 'from-rose-500 to-rose-600'
  };
}

export function getStatusColor(status) {
  const statusColors = {
    'active': 'bg-green-50 text-green-700',
    'inactive': 'bg-gray-50 text-gray-600',
    'pending': 'bg-amber-50 text-amber-600',
    'completed': 'bg-green-50 text-green-700',
    'on-leave': 'bg-orange-50 text-orange-600',
    'suspended': 'bg-red-50 text-red-600'
  };
  return statusColors[status?.toLowerCase()] || 'bg-surface-50 text-gray-600';
}

export function renderIcon(iconName, size = 'w-5 h-5') {
  return `<i data-lucide="${iconName}" class="${size}"></i>`;
}

export function createAnimationClass() {
  return 'fade-in';
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function createDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}
