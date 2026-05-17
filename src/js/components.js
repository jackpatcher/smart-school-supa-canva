// ============================================
// REUSABLE UI COMPONENTS
// ============================================

/**
 * Card Component
 */
export function createCard(props) {
  const {
    title,
    description,
    icon,
    color = 'bg-brand-100',
    textColor = 'text-brand-600',
    children = '',
    className = ''
  } = props;

  return `
    <div class="bg-white rounded-2xl border border-surface-200 p-5 card-hover ${className}">
      ${icon ? `
        <div class="w-10 h-10 ${color} ${textColor} rounded-xl flex items-center justify-center mb-3">
          <i data-lucide="${icon}" class="w-5 h-5"></i>
        </div>
      ` : ''}
      ${title ? `<h4 class="text-sm font-semibold text-gray-800 mb-1">${title}</h4>` : ''}
      ${description ? `<p class="text-xs text-gray-500 mb-2">${description}</p>` : ''}
      ${children}
    </div>
  `;
}

/**
 * Stat Card Component
 */
export function createStatCard(props) {
  const {
    label,
    value,
    icon,
    color = 'blue',
    change = ''
  } = props;

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600'
  };

  return `
    <div class="bg-white rounded-2xl p-5 border border-surface-200 card-hover">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center shadow-lg">
          <i data-lucide="${icon}" class="w-5 h-5 text-white"></i>
        </div>
        ${change ? `<span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">${change}</span>` : ''}
      </div>
      <p class="text-2xl font-bold text-gray-800">${value}</p>
      <p class="text-xs text-gray-500 mt-0.5">${label}</p>
    </div>
  `;
}

/**
 * Button Component
 */
export function createButton(props) {
  const {
    label,
    onClick = '',
    variant = 'primary',
    size = 'md',
    icon = '',
    disabled = false,
    className = ''
  } = props;

  const variantClasses = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-200',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    ghost: 'bg-transparent hover:bg-surface-100 text-gray-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return `
    <button 
      ${onClick ? `onclick="${onClick}"` : ''}
      ${disabled ? 'disabled' : ''}
      class="flex items-center gap-2 font-medium rounded-xl transition ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}"
    >
      ${icon ? `<i data-lucide="${icon}" class="w-4 h-4"></i>` : ''}
      ${label}
    </button>
  `;
}

/**
 * Input Component
 */
export function createInput(props) {
  const {
    id = '',
    type = 'text',
    placeholder = '',
    label = '',
    value = '',
    required = false,
    className = ''
  } = props;

  return `
    ${label ? `<label for="${id}" class="block text-xs font-medium text-gray-500 mb-1.5">${label}</label>` : ''}
    <input
      id="${id}"
      type="${type}"
      placeholder="${placeholder}"
      value="${value}"
      ${required ? 'required' : ''}
      class="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition ${className}"
    />
  `;
}

/**
 * Badge Component
 */
export function createBadge(props) {
  const {
    label,
    variant = 'primary',
    size = 'sm'
  } = props;

  const variantClasses = {
    primary: 'bg-brand-100 text-brand-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-surface-100 text-gray-600'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return `<span class="font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}">${label}</span>`;
}

/**
 * Avatar Component
 */
export function createAvatar(props) {
  const {
    initials,
    size = 'md',
    backgroundColor = 'bg-brand-100',
    textColor = 'text-brand-700'
  } = props;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return `
    <div class="${sizeClasses[size]} ${backgroundColor} ${textColor} rounded-full flex items-center justify-center font-bold">
      ${initials}
    </div>
  `;
}

/**
 * Table Row Component
 */
export function createTableRow(cols, isHeader = false) {
  const cellTag = isHeader ? 'th' : 'td';
  const cellClass = isHeader 
    ? 'text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3'
    : 'px-5 py-4 text-sm text-gray-700';

  return `
    <tr class="${!isHeader ? 'hover:bg-surface-50 transition border-b border-surface-100' : ''}">
      ${cols.map(col => `<${cellTag} class="${cellClass}">${col}</${cellTag}>`).join('')}
    </tr>
  `;
}

/**
 * Modal Component
 */
export function createModal(props) {
  const {
    id,
    title,
    body,
    footerButtons = []
  } = props;

  return `
    <div id="${id}" class="hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 fade-in">
        <div class="px-6 py-4 border-b border-surface-100">
          <h2 class="text-lg font-bold text-gray-800">${title}</h2>
        </div>
        <div class="px-6 py-4">
          ${body}
        </div>
        ${footerButtons.length > 0 ? `
          <div class="px-6 py-4 border-t border-surface-100 flex gap-3 justify-end">
            ${footerButtons.map(btn => `
              <button 
                onclick="${btn.onClick}"
                class="px-4 py-2 rounded-lg font-medium text-sm ${btn.primary ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-surface-100 hover:bg-surface-200 text-gray-800'} transition"
              >
                ${btn.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Alert Component
 */
export function createAlert(props) {
  const {
    message,
    type = 'info',
    dismissible = true
  } = props;

  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconMap = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info'
  };

  return `
    <div class="flex items-center gap-3 p-4 rounded-xl border ${typeClasses[type]}">
      <i data-lucide="${iconMap[type]}" class="w-5 h-5 flex-shrink-0"></i>
      <span class="flex-1 text-sm">${message}</span>
      ${dismissible ? `<button onclick="this.parentElement.remove()" class="text-opacity-50 hover:text-opacity-100 transition"><i data-lucide="x" class="w-4 h-4"></i></button>` : ''}
    </div>
  `;
}

/**
 * Grid Component
 */
export function createGrid(items, cols = 3) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return `
    <div class="grid ${gridClass[cols]} gap-4">
      ${items.join('')}
    </div>
  `;
}

/**
 * Loading Spinner Component
 */
export function createSpinner(size = 'md') {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return `
    <div class="${sizeMap[size]} border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin"></div>
  `;
}

/**
 * Empty State Component
 */
export function createEmptyState(props) {
  const {
    icon,
    title,
    description,
    actionButton = null
  } = props;

  return `
    <div class="bg-white rounded-2xl border border-surface-200 p-12 text-center">
      <i data-lucide="${icon}" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
      <h3 class="text-lg font-semibold text-gray-700 mb-1">${title}</h3>
      <p class="text-sm text-gray-500 mb-6">${description}</p>
      ${actionButton ? createButton(actionButton) : ''}
    </div>
  `;
}

/**
 * Form Group Component
 */
export function createFormGroup(props) {
  const {
    label,
    inputs = [],
    helpText = ''
  } = props;

  return `
    <div class="mb-4">
      ${label ? `<label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>` : ''}
      ${inputs.map(input => createInput(input)).join('')}
      ${helpText ? `<p class="text-xs text-gray-500 mt-1">${helpText}</p>` : ''}
    </div>
  `;
}

/**
 * Activity Item Component
 */
export function createActivityItem(props) {
  const {
    text,
    time,
    dotColor = 'bg-gray-400'
  } = props;

  return `
    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 transition">
      <span class="w-2 h-2 ${dotColor} rounded-full shrink-0"></span>
      <p class="text-sm text-gray-700 flex-1">${text}</p>
      <span class="text-[10px] text-gray-400 shrink-0">${time}</span>
    </div>
  `;
}

/**
 * Section Header Component
 */
export function createSectionHeader(props) {
  const {
    title,
    description = '',
    actionButton = null
  } = props;

  return `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">${title}</h2>
        ${description ? `<p class="text-sm text-gray-500 mt-1">${description}</p>` : ''}
      </div>
      ${actionButton ? createButton(actionButton) : ''}
    </div>
  `;
}
