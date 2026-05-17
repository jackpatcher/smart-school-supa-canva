# 🏫 Smart School Platform - Refactored Structure

แพลตฟอร์มโรงเรียนแบบมัลติ-เทนเนนท์พร้อมโครงสร้างโมดูลาร์ที่เข้าใจง่ายและแก้ไขง่าย

## 📁 โครงสร้างโปรเจ็ก

```
smart-school-supa-canva/
├── index-new.html              # ไฟล์ main entry point ใหม่
├── web.html                    # ไฟล์ old monolith (reference)
├── src/
│   ├── css/
│   │   └── styles.css          # Global styles
│   ├── js/
│   │   ├── app.js              # Main app logic & routing
│   │   ├── auth.js             # Authentication system
│   │   ├── components.js       # Reusable UI components
│   │   ├── config.js           # Constants & configuration
│   │   ├── utils.js            # Utility functions
│   │   └── modules/
│   │       ├── dashboard.js    # Dashboard module
│   │       ├── students.js     # Students module (ready to add)
│   │       ├── teachers.js     # Teachers module (ready to add)
│   │       ├── finance.js      # Finance module (ready to add)
│   │       ├── reports.js      # Reports module (ready to add)
│   │       └── ...             # Other modules
│   └── pages/
│       ├── splash.html         # Splash screen (future)
│       ├── landing.html        # Landing page (future)
│       ├── login.html          # Login page (future)
│       └── dashboard.html      # Dashboard (future)
├── supabase.sql                # Database schema
├── README.md                   # This file
└── docs/
    ├── ARCHITECTURE.md         # Architecture documentation
    ├── COMPONENTS.md           # Component library
    └── MODULES.md              # Module structure guide
```

## 🚀 ฟีเจอร์ปลักแกน

✅ **Multi-tenant Architecture**
- สนับสนุนหลายโรงเรียน (SCH001, SCH002)
- แยกข้อมูลโรงเรียนอย่างปลอดภัย

✅ **Role-Based Access Control**
- 5 บทบาท: Admin, Teacher, Student, Parent, Executive
- Custom menus ตามบทบาท

✅ **Modular Components**
- UI components ที่ใช้ซ้ำได้
- Dashboard, Students, Teachers, Finance, Reports

✅ **App Store**
- ติดตั้ง/ลบแอปได้
- Permissions based on role
- 8 built-in apps

✅ **Thai Localization**
- ข้อความทั้งหมดเป็นภาษาไทย
- Unicode support

## 🔧 การใช้งาน

### เปิดแอปพลิเคชัน

```bash
# Simple HTTP server
python3 -m http.server 8000
# หรือ
npx serve
```

จากนั้นเปิด: `http://localhost:8000/index-new.html`

### Demo Credentials

```
School Code: SCH001
Username: admin001
Password: admin123

อื่นๆ:
- teacher001 / teach123 (Teacher)
- student001 / stud123 (Student)
- parent001 / par123 (Parent)
- exec001 / exec123 (Executive)
```

## 📦 Modules & Components

### Reusable Components (`src/js/components.js`)

```javascript
// Cards
createCard(props)          // Basic card
createStatCard(props)      // Stat card with icon
createCard(props)          // Feature card

// Forms
createInput(props)         // Input field
createFormGroup(props)     // Form group with label

// UI Elements
createButton(props)        // Button (multiple variants)
createBadge(props)         // Badge
createAvatar(props)        // Avatar circle
createAlert(props)         // Alert message
createModal(props)         // Modal dialog

// Lists & Tables
createTableRow(cols)       // Table row
createActivityItem(props)  // Activity feed item

// Layout
createGrid(items, cols)    // Grid layout
createEmptyState(props)    // Empty state

// Utils
createSpinner(size)        // Loading spinner
createSectionHeader(props) // Section header
```

### Utility Functions (`src/js/utils.js`)

```javascript
showToast(message, type)   // Show toast notification
formatDate(date)           // Format date
formatCurrency(amount)     // Format currency
truncate(text, length)     // Truncate text
getInitials(name)          // Get initials from name
validateEmail(email)       // Email validation
validatePassword(password) // Password validation
```

### Config & Constants (`src/js/config.js`)

```javascript
COLORS                     // Color palette
APP_STATE                  // Global app state
DEMO_USERS                 // Demo user database
CORE_MODULES               // Role-based modules
AVAILABLE_APPS             // 8 built-in apps
```

## 🔒 Authentication (`src/js/auth.js`)

```javascript
handleLogin(e)             // Login form handler
completeLogin()            // Finalize login
handleLogout()             // Logout handler
isAuthenticated()          // Check auth status
getCurrentUser()           // Get current user
getCurrentRole()           // Get user role
```

## 🎨 Styling

**Tailwind CSS** with custom theme:
- Brand colors: #2563eb (primary), #059669 (secondary)
- Surface colors for backgrounds
- Custom animations (fade-in, pulse)

**Global Styles** (`src/css/styles.css`):
- Animations
- Sidebar styling
- Card hover effects
- Scrollbar styling
- Responsive utilities

## 📝 การเพิ่มโมดูลใหม่

### 1. สร้างไฟล์โมดูล

```javascript
// src/js/modules/mymodule.js
export function getMyModuleContent(role = 'admin') {
  return `<div>My Module Content</div>`;
}
```

### 2. เพิ่มในโครงสร้าง

แก้ไข `CORE_MODULES` ใน `config.js`:
```javascript
admin: [
  { id: 'mymodule', icon: 'icon-name', label: 'My Module' },
  // ...
]
```

### 3. เพิ่ม router ใน `app.js`

```javascript
function getModuleContent(moduleId) {
  switch(moduleId) {
    case 'mymodule':
      return getMyModuleContent(APP_STATE.currentRole);
    // ...
  }
}
```

## 🔄 State Management

**Global App State** (`APP_STATE`):
```javascript
{
  currentUser,           // Logged-in user
  currentSchool,         // Current school
  currentRole,           // User role
  currentModule,         // Active module
  isAuthenticated,       // Auth status
  allUsers,              // User list
  userInstalledApps,     // User's installed apps
}
```

**LocalStorage Keys**:
- `apps_[schoolCode]_[username]` - User's installed apps
- `apps_enabled_[schoolCode]` - Global app enablement

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sidebar collapses on mobile (future enhancement)

## 🛠️ Development Workflow

1. **Add new component** → Edit `components.js`
2. **Add new utility** → Edit `utils.js`
3. **Create module** → New file in `modules/`
4. **Update config** → Edit `config.js`
5. **Update routing** → Edit `app.js`

## 🚀 Future Enhancements

- [ ] Supabase integration
- [ ] Real-time sync
- [ ] Mobile app
- [ ] API documentation
- [ ] Unit tests
- [ ] E2E tests
- [ ] CI/CD pipeline
- [ ] Docker deployment

## 📚 Documentation

See `docs/` folder:
- `ARCHITECTURE.md` - System architecture
- `COMPONENTS.md` - Component reference
- `MODULES.md` - Module development guide

## 🤝 Contributing

1. Create new branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

MIT License

---

**Version**: 1.0 (Refactored from monolith)
**Last Updated**: 2025-01-20
**Status**: Production-ready
