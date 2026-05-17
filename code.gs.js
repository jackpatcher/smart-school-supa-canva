// ============================================
// SMART SCHOOL PLATFORM - Google Apps Script
// Google Sheets Backend for Data Persistence
// ============================================

// CONFIGURATION
const SHEET_ID = 'YOUR_SPREADSHEET_ID'; // แก้ไข: วาง ID ของ Google Sheet ของคุณ
const USERS_SHEET = 'Users'; // ชื่อ Sheet สำหรับเก็บผู้ใช้
const SAMPLE_DATA_LOADED_KEY = 'SAMPLE_DATA_LOADED_v1';

/**
 * ============================================
 * SETUP: เรียกใช้ครั้งแรกเพื่อเตรียมข้อมูล
 * ============================================
 */
function setupSpreadsheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  // สร้าง Sheet ถ้ายังไม่มี
  if (!spreadsheet.getSheetByName(USERS_SHEET)) {
    spreadsheet.insertSheet(USERS_SHEET);
    Logger.log('✅ สร้าง Sheet "Users" สำเร็จ');
  }
  
  const sheet = spreadsheet.getSheetByName(USERS_SHEET);
  
  // ตั้งค่า Header ถ้ายังไม่มี
  if (sheet.getLastRow() === 0) {
    const headers = [
      'id',
      'school_code',
      'user_id',
      'username',
      'role',
      'name',
      'email',
      'phone',
      'status',
      'created_at',
      'updated_at'
    ];
    sheet.appendRow(headers);
    Logger.log('✅ สร้าง Header สำเร็จ');
  }
  
  // โหลดข้อมูลตัวอย่างครั้งแรก
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty(SAMPLE_DATA_LOADED_KEY)) {
    loadSampleData(sheet);
    properties.setProperty(SAMPLE_DATA_LOADED_KEY, 'true');
    Logger.log('✅ โหลดข้อมูลตัวอย่างสำเร็จ');
  }
}

/**
 * โหลดข้อมูลตัวอย่าง
 */
function loadSampleData(sheet) {
  const sampleUsers = [
    {
      id: 'user_001',
      school_code: 'SCH001',
      user_id: 'admin001',
      username: 'admin001',
      role: 'admin',
      name: 'Sarah Johnson',
      email: 'sarah@brightfuture.edu',
      phone: '+1-555-0101',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_002',
      school_code: 'SCH001',
      user_id: 'teacher001',
      username: 'teacher001',
      role: 'teacher',
      name: 'Michael Chen',
      email: 'michael@brightfuture.edu',
      phone: '+1-555-0102',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_003',
      school_code: 'SCH001',
      user_id: 'student001',
      username: 'student001',
      role: 'student',
      name: 'Emma Wilson',
      email: 'emma@brightfuture.edu',
      phone: '+1-555-0103',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_004',
      school_code: 'SCH001',
      user_id: 'teacher002',
      username: 'teacher002',
      role: 'teacher',
      name: 'Patricia Gomez',
      email: 'patricia@brightfuture.edu',
      phone: '+1-555-0104',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_005',
      school_code: 'SCH001',
      user_id: 'student002',
      username: 'student002',
      role: 'student',
      name: 'Liam Parker',
      email: 'liam@brightfuture.edu',
      phone: '+1-555-0105',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_006',
      school_code: 'SCH001',
      user_id: 'parent001',
      username: 'parent001',
      role: 'parent',
      name: 'Robert Wilson',
      email: 'robert@brightfuture.edu',
      phone: '+1-555-0106',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'user_007',
      school_code: 'SCH001',
      user_id: 'exec001',
      username: 'exec001',
      role: 'executive',
      name: 'Diana Roberts',
      email: 'diana@brightfuture.edu',
      phone: '+1-555-0107',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  sampleUsers.forEach(user => {
    sheet.appendRow([
      user.id,
      user.school_code,
      user.user_id,
      user.username,
      user.role,
      user.name,
      user.email,
      user.phone,
      user.status,
      user.created_at,
      user.updated_at
    ]);
  });
}

/**
 * ============================================
 * CRUD OPERATIONS
 * ============================================
 */

/**
 * สร้างผู้ใช้ใหม่
 */
function createUser(userData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(USERS_SHEET);
    
    const now = new Date().toISOString();
    const row = [
      userData.id || `user_${Date.now()}`,
      userData.school_code || 'SCH001',
      userData.user_id || '',
      userData.username || '',
      userData.role || 'user',
      userData.name || '',
      userData.email || '',
      userData.phone || '',
      userData.status || 'active',
      userData.created_at || now,
      userData.updated_at || now
    ];
    
    sheet.appendRow(row);
    
    return {
      success: true,
      message: 'ผู้ใช้ถูกสร้างสำเร็จ',
      data: { id: row[0] }
    };
  } catch (error) {
    Logger.log('❌ Error creating user: ' + error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.message
    };
  }
}

/**
 * อ่านผู้ใช้ทั้งหมด
 */
function getAllUsers() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        message: 'ไม่มีข้อมูล',
        data: []
      };
    }

    const headers = data[0];
    const users = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return {
      success: true,
      message: 'ดึงข้อมูลสำเร็จ',
      data: users
    };
  } catch (error) {
    Logger.log('❌ Error reading users: ' + error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.message,
      data: []
    };
  }
}

/**
 * อ้อนผู้ใช้ตาม ID
 */
function getUserById(userId) {
  try {
    const result = getAllUsers();
    if (!result.success) return result;

    const user = result.data.find(u => u.id === userId);
    
    return {
      success: !!user,
      message: user ? 'พบผู้ใช้' : 'ไม่พบผู้ใช้',
      data: user || null
    };
  } catch (error) {
    Logger.log('❌ Error reading user: ' + error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.message
    };
  }
}

/**
 * อัปเดตผู้ใช้
 */
function updateUser(userId, updateData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) { // id คือ column 0
        // อัปเดตข้อมูล
        headers.forEach((header, colIndex) => {
          if (updateData.hasOwnProperty(header)) {
            sheet.getRange(i + 1, colIndex + 1).setValue(updateData[header]);
          }
        });
        
        // อัปเดต updated_at
        const updatedAtIndex = headers.indexOf('updated_at');
        if (updatedAtIndex !== -1) {
          sheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date().toISOString());
        }
        
        found = true;
        break;
      }
    }

    return {
      success: found,
      message: found ? 'อัปเดตผู้ใช้สำเร็จ' : 'ไม่พบผู้ใช้',
      data: found ? { id: userId } : null
    };
  } catch (error) {
    Logger.log('❌ Error updating user: ' + error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.message
    };
  }
}

/**
 * ลบผู้ใช้
 */
function deleteUser(userId) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) { // id คือ column 0
        sheet.deleteRow(i + 1);
        return {
          success: true,
          message: 'ลบผู้ใช้สำเร็จ',
          data: { id: userId }
        };
      }
    }

    return {
      success: false,
      message: 'ไม่พบผู้ใช้',
      data: null
    };
  } catch (error) {
    Logger.log('❌ Error deleting user: ' + error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.message
    };
  }
}

/**
 * ============================================
 * WEB APP ENDPOINTS (Deploy as Web App)
 * ============================================
 */

function doGet(e) {
  const action = e.parameter.action || 'list';

  try {
    switch (action) {
      case 'list':
        return sendResponse(getAllUsers());
      
      case 'get':
        return sendResponse(getUserById(e.parameter.id));
      
      default:
        return sendResponse({
          success: false,
          message: 'Unknown action: ' + action
        });
    }
  } catch (error) {
    return sendResponse({
      success: false,
      message: error.message
    });
  }
}

function doPost(e) {
  const action = e.parameter.action || 'create';
  let data = {};

  try {
    if (e.postData.type === ContentService.MimeType.JSON) {
      data = JSON.parse(e.postData.contents);
    }

    switch (action) {
      case 'create':
        return sendResponse(createUser(data));
      
      case 'update':
        return sendResponse(updateUser(data.id, data));
      
      case 'delete':
        return sendResponse(deleteUser(data.id));
      
      default:
        return sendResponse({
          success: false,
          message: 'Unknown action: ' + action
        });
    }
  } catch (error) {
    return sendResponse({
      success: false,
      message: error.message
    });
  }
}

/**
 * ส่งการตอบสนอง JSON
 */
function sendResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ============================================
 * TESTING FUNCTIONS
 * ============================================
 */

function testCreateUser() {
  const result = createUser({
    id: 'user_' + Date.now(),
    school_code: 'SCH001',
    username: 'testuser',
    role: 'student',
    name: 'Test User',
    email: 'test@school.edu',
    phone: '+1-555-9999',
    status: 'active'
  });
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetAllUsers() {
  const result = getAllUsers();
  Logger.log(JSON.stringify(result, null, 2));
}

function testUpdateUser() {
  // ค้นหา user แรกสำหรับการทดสอบ
  const users = getAllUsers();
  if (users.data.length > 0) {
    const result = updateUser(users.data[0].id, {
      status: 'inactive',
      name: 'Updated Name'
    });
    Logger.log(JSON.stringify(result, null, 2));
  }
}

function testDeleteUser() {
  // ลบ user สุดท้าย (ไม่ใช่ข้อมูลตัวอย่าง)
  const users = getAllUsers();
  if (users.data.length > 7) { // ข้อมูลตัวอย่าง 7 คน
    const result = deleteUser(users.data[users.data.length - 1].id);
    Logger.log(JSON.stringify(result, null, 2));
  }
}
