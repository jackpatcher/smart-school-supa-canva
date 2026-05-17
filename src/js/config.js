// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

export const COLORS = {
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  surface: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0'
  }
};

export const APP_STATE = {
  currentUser: null,
  currentSchool: null,
  currentRole: 'admin',
  currentModule: 'dashboard',
  isAuthenticated: false,
  allUsers: [],
  userInstalledApps: [],
  supabaseUrl: '',
  supabaseKey: ''
};

export const DEMO_USERS = {
  'SCH001': {
    school_name: 'Bright Future Academy',
    school_code: 'SCH001',
    theme_color: '#2563eb',
    users: {
      'admin001': { password: 'admin123', role: 'admin', name: 'Sarah Johnson', email: 'sarah@brightfuture.edu', phone: '+1-555-0101' },
      'teacher001': { password: 'teach123', role: 'teacher', name: 'Michael Chen', email: 'michael@brightfuture.edu', phone: '+1-555-0102' },
      'student001': { password: 'stud123', role: 'student', name: 'Emma Wilson', email: 'emma@brightfuture.edu', phone: '+1-555-0103' },
      'parent001': { password: 'par123', role: 'parent', name: 'Robert Wilson', email: 'robert@brightfuture.edu', phone: '+1-555-0104' },
      'exec001': { password: 'exec123', role: 'executive', name: 'Diana Roberts', email: 'diana@brightfuture.edu', phone: '+1-555-0105' }
    }
  },
  'SCH002': {
    school_name: 'Green Valley School',
    school_code: 'SCH002',
    theme_color: '#059669',
    users: {
      'admin001': { password: 'admin123', role: 'admin', name: 'John Smith', email: 'john@greenvalley.edu', phone: '+1-555-0201' }
    }
  }
};

export const CORE_MODULES = {
  admin: [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'แดชบอร์ด' },
    { id: 'students', icon: 'graduation-cap', label: 'นักเรียน' },
    { id: 'teachers', icon: 'briefcase', label: 'ครู' },
    { id: 'academic', icon: 'book-open', label: 'การศึกษา' },
    { id: 'finance', icon: 'wallet', label: 'การเงิน' },
    { id: 'reports', icon: 'bar-chart-3', label: 'รายงาน' },
    { id: 'app-management', icon: 'sliders-horizontal', label: 'การจัดการแอป' },
    { id: 'app-store', icon: 'grid-3x3-gap', label: 'ร้านแอป' },
    { id: 'settings', icon: 'settings', label: 'การตั้งค่า' }
  ],
  teacher: [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'แดชบอร์ด' },
    { id: 'academic', icon: 'book-open', label: 'ชั้นเรียนของผม' },
    { id: 'students', icon: 'users', label: 'นักเรียนของผม' },
    { id: 'app-store', icon: 'grid-3x3-gap', label: 'ร้านแอป' }
  ],
  student: [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'แดชบอร์ด' },
    { id: 'academic', icon: 'book-open', label: 'คอร์สของผม' },
    { id: 'app-store', icon: 'grid-3x3-gap', label: 'ร้านแอป' }
  ],
  parent: [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'แดชบอร์ด' },
    { id: 'app-store', icon: 'grid-3x3-gap', label: 'ร้านแอป' }
  ],
  executive: [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'แดชบอร์ด' },
    { id: 'reports', icon: 'bar-chart-3', label: 'การวิเคราะห์' },
    { id: 'finance', icon: 'wallet', label: 'การเงิน' },
    { id: 'app-management', icon: 'sliders-horizontal', label: 'การจัดการแอป' },
    { id: 'app-store', icon: 'grid-3x3-gap', label: 'ร้านแอป' }
  ]
};

export const AVAILABLE_APPS = [
  { 
    id: 'eoffice', 
    name: 'eOffice', 
    category: 'Workflow', 
    description: 'Digital document management', 
    icon: '📄', 
    version: '1.0.0', 
    allowed_roles: ['admin', 'executive', 'teacher'], 
    permissions: {
      admin: { canSign: true, canApprove: true, canManage: true },
      executive: { canSign: true, canApprove: true, canManage: false },
      teacher: { canSign: true, canApprove: false, canManage: false },
      student: {}, parent: {}
    }
  },
  {
    id: 'library',
    name: 'Library Plus',
    category: 'Academic',
    description: 'Advanced library management',
    icon: '📚',
    version: '2.1.0',
    allowed_roles: ['admin', 'teacher', 'student'],
    permissions: {
      admin: { canManage: true, canBorrow: true },
      teacher: { canBorrow: true, canManage: false },
      student: { canBorrow: true, canManage: false },
      parent: {}, executive: {}
    }
  },
  {
    id: 'messaging',
    name: 'School Messaging',
    category: 'Communication',
    description: 'Secure messaging system',
    icon: '💬',
    version: '1.5.0',
    allowed_roles: ['admin', 'teacher', 'parent'],
    permissions: {
      admin: { canManage: true, canMessage: true },
      teacher: { canMessage: true, canManage: false },
      student: {}, parent: { canMessage: true, canManage: false }, executive: {}
    }
  },
  {
    id: 'assignments',
    name: 'Assignment Manager',
    category: 'Academic',
    description: 'Create and grade assignments',
    icon: '✏️',
    version: '1.2.0',
    allowed_roles: ['admin', 'teacher', 'student', 'parent'],
    permissions: {
      admin: { canManage: true },
      teacher: { canCreate: true, canGrade: true },
      student: { canSubmit: true, canView: true },
      parent: { canView: true }, executive: {}
    }
  },
  {
    id: 'events',
    name: 'Event Calendar',
    category: 'General',
    description: 'Event management system',
    icon: '📅',
    version: '1.0.0',
    allowed_roles: ['admin', 'teacher', 'student', 'parent', 'executive'],
    permissions: {
      admin: { canManage: true },
      teacher: { canView: true },
      student: { canView: true },
      parent: { canView: true },
      executive: { canManage: true, canView: true }
    }
  },
  {
    id: 'fees',
    name: 'Fee Management',
    category: 'Finance',
    description: 'Fee collection system',
    icon: '💰',
    version: '1.3.0',
    allowed_roles: ['admin', 'student', 'parent', 'executive'],
    permissions: {
      admin: { canManage: true, canCollect: true },
      teacher: {},
      student: { canPayOnline: true, canView: true },
      parent: { canPayOnline: true, canView: true },
      executive: { canManage: true, canView: true }
    }
  },
  {
    id: 'transport',
    name: 'Transport Tracking',
    category: 'Operations',
    description: 'Bus tracking system',
    icon: '🚌',
    version: '1.4.0',
    allowed_roles: ['admin', 'teacher', 'student', 'parent', 'executive'],
    permissions: {
      admin: { canManage: true },
      teacher: { canView: true },
      student: { canTrack: true },
      parent: { canTrack: true },
      executive: { canManage: true }
    }
  },
  {
    id: 'hostel',
    name: 'Hostel Management',
    category: 'Operations',
    description: 'Hostel management system',
    icon: '🏠',
    version: '1.1.0',
    allowed_roles: ['admin', 'teacher', 'student', 'parent', 'executive'],
    permissions: {
      admin: { canManage: true },
      teacher: { canView: true },
      student: { canRequest: true, canView: true },
      parent: { canView: true },
      executive: { canManage: true }
    }
  }
];
