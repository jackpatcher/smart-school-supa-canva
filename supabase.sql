-- ============================================
-- SMART SCHOOL PLATFORM - Database Schema
-- ============================================

-- 1. Users Table (เก็บข้อมูลผู้ใช้ทั้งหมด)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent', 'executive')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_code, username)
);

-- 2. Student Profiles (ข้อมูลเฉพาะนักเรียน)
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_code TEXT NOT NULL,
  admission_number TEXT UNIQUE,
  grade TEXT NOT NULL,
  section TEXT,
  date_of_birth DATE,
  guardian_name TEXT,
  guardian_phone TEXT,
  blood_group TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Teacher Profiles (ข้อมูลเฉพาะครู)
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_code TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  subject TEXT,
  qualification TEXT,
  experience_years INTEGER,
  joining_date DATE DEFAULT CURRENT_DATE,
  department TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. User Installed Apps (ติดตั้งแอพของ User)
CREATE TABLE IF NOT EXISTS user_installed_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  username TEXT NOT NULL,
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  installed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_code, username, app_id)
);

-- 5. Enabled Apps (แอพที่เปิดใช้ทั่วโรงเรียน)
CREATE TABLE IF NOT EXISTS enabled_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  enabled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_code, app_id)
);

-- 6. Attendance (บันทึกการเข้าเรียน)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'leave')),
  remarks TEXT,
  recorded_by TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_code, user_id, date)
);

-- 7. Grades (บันทึกคะแนน)
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  exam_type TEXT CHECK (exam_type IN ('unit-test', 'midterm', 'final')),
  marks_obtained DECIMAL(5, 2),
  total_marks DECIMAL(5, 2),
  percentage DECIMAL(5, 2),
  grade_letter TEXT,
  recorded_by TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Payments (ใบเรียกเก็บ/ชำระเงิน)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  fee_type TEXT CHECK (fee_type IN ('tuition', 'library', 'activity', 'transport', 'exam', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  reference_number TEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Classes (ห้องเรียน)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  capacity INTEGER,
  current_strength INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_code, grade, section)
);

-- 10. Class Subjects (วิชาในห้อง)
CREATE TABLE IF NOT EXISTS class_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  credits INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Announcements (ประกาศโรงเรียน)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('general', 'event', 'alert', 'maintenance')),
  target_roles TEXT[], -- ARRAY of roles like ['student', 'teacher']
  posted_by TEXT,
  posted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 12. Events (กิจกรรมและเหตุการณ์)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('academic', 'sports', 'cultural', 'meeting', 'other')),
  organized_by TEXT,
  capacity INTEGER,
  registrations INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Messages (ข้อความระหว่างผู้ใช้)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- 14. Audit Log (บันทึกการเข้าใช้ระบบ)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code TEXT NOT NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT,
  details TEXT,
  ip_address TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES (สำหรับ Performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_code);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_username ON users(school_code, username);
CREATE INDEX IF NOT EXISTS idx_student_profiles_school ON student_profiles(school_code);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_school ON teacher_profiles(school_code);
CREATE INDEX IF NOT EXISTS idx_attendance_school_date ON attendance(school_code, date);
CREATE INDEX IF NOT EXISTS idx_grades_school ON grades(school_code);
CREATE INDEX IF NOT EXISTS idx_payments_school_status ON payments(school_code, status);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_code);
CREATE INDEX IF NOT EXISTS idx_announcements_school ON announcements(school_code);
CREATE INDEX IF NOT EXISTS idx_events_school ON events(school_code);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON audit_logs(school_code, logged_at);

-- ============================================
-- INITIAL DATA - SCH001 (Demo School)
-- ============================================

-- Insert Admin User
INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES ('SCH001', 'admin001', 'admin', 'Sarah Johnson', 'sarah@brightfuture.edu', '+1-555-0101', 'active')
ON CONFLICT DO NOTHING;

-- Insert Teachers
INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES 
('SCH001', 'teacher001', 'teacher', 'Michael Chen', 'michael@brightfuture.edu', '+1-555-0102', 'active'),
('SCH001', 'teacher002', 'teacher', 'Patricia Gomez', 'patricia@brightfuture.edu', '+1-555-0103', 'active'),
('SCH001', 'teacher003', 'teacher', 'Ahmed Hassan', 'ahmed@brightfuture.edu', '+1-555-0104', 'active'),
('SCH001', 'teacher004', 'teacher', 'Lisa Park', 'lisa@brightfuture.edu', '+1-555-0105', 'active')
ON CONFLICT DO NOTHING;

-- Insert Students
INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES 
('SCH001', 'student001', 'student', 'Emma Wilson', 'emma@brightfuture.edu', '+1-555-0201', 'active'),
('SCH001', 'student002', 'student', 'Liam Parker', 'liam@brightfuture.edu', '+1-555-0202', 'active'),
('SCH001', 'student003', 'student', 'Aisha Rahman', 'aisha@brightfuture.edu', '+1-555-0203', 'active'),
('SCH001', 'student004', 'student', 'Carlos Mendez', 'carlos@brightfuture.edu', '+1-555-0204', 'active'),
('SCH001', 'student005', 'student', 'Yuki Tanaka', 'yuki@brightfuture.edu', '+1-555-0205', 'active')
ON CONFLICT DO NOTHING;

-- Insert Parents
INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES 
('SCH001', 'parent001', 'parent', 'Robert Wilson', 'robert@brightfuture.edu', '+1-555-0301', 'active'),
('SCH001', 'parent002', 'parent', 'Maria Garcia', 'maria@brightfuture.edu', '+1-555-0302', 'active')
ON CONFLICT DO NOTHING;

-- Insert Executive
INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES ('SCH001', 'exec001', 'executive', 'Diana Roberts', 'diana@brightfuture.edu', '+1-555-0401', 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIAL DATA - SCH002 (Green Valley School)
-- ============================================

INSERT INTO users (school_code, username, role, name, email, phone, status)
VALUES 
('SCH002', 'admin001', 'admin', 'John Smith', 'john@greenvalley.edu', '+1-555-1001', 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- ENABLE ALL DEFAULT APPS FOR SCH001
-- ============================================

INSERT INTO enabled_apps (school_code, app_id, app_name, enabled)
VALUES 
('SCH001', 'eoffice', 'eOffice', true),
('SCH001', 'library', 'Library Plus', true),
('SCH001', 'messaging', 'School Messaging', true),
('SCH001', 'assignments', 'Assignment Manager', true),
('SCH001', 'events', 'Event Calendar', true),
('SCH001', 'fees', 'Fee Management', true),
('SCH001', 'transport', 'Transport Tracking', true),
('SCH001', 'hostel', 'Hostel Management', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE ANNOUNCEMENTS
-- ============================================

INSERT INTO announcements (school_code, title, content, announcement_type, target_roles, posted_by, expires_at)
VALUES 
('SCH001', 'Sports Day Registration Open', 'Register your child for the annual sports day event by Jan 20.', 'event', '{"student","parent"}', 'admin001', NOW() + INTERVAL '10 days'),
('SCH001', 'School Closed - Public Holiday', 'School will be closed on Jan 26 for Republic Day.', 'alert', '{"admin","teacher","student","parent","executive"}', 'admin001', NOW() + INTERVAL '5 days'),
('SCH001', 'Grade Report Available', 'Semester 1 grades have been published in the portal.', 'general', '{"student","parent"}', 'teacher001', NOW() + INTERVAL '15 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE EVENTS
-- ============================================

INSERT INTO events (school_code, event_name, event_date, start_time, end_time, location, event_type, organized_by, capacity)
VALUES 
('SCH001', 'Parent-Teacher Meeting', '2025-01-15', '10:00:00', '13:00:00', 'School Auditorium', 'meeting', 'admin001', 500),
('SCH001', 'Annual Sports Day', '2025-01-22', '08:00:00', '16:00:00', 'School Ground', 'sports', 'teacher002', 1000),
('SCH001', 'Science Fair', '2025-02-03', '09:00:00', '17:00:00', 'School Campus', 'academic', 'teacher001', 300)
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE CLASSES
-- ============================================

INSERT INTO classes (school_code, grade, section, capacity, current_strength)
VALUES 
('SCH001', 'Grade 9', 'A', 50, 45),
('SCH001', 'Grade 10', 'A', 50, 48),
('SCH001', 'Grade 10', 'B', 50, 46),
('SCH001', 'Grade 11', 'A', 50, 42)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS POLICIES (Optional - สำหรับ Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_installed_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enabled_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users (allow read all)
CREATE POLICY "Users can read all users within same school"
ON users FOR SELECT
USING (true);

CREATE POLICY "Users can read all announcements"
ON announcements FOR SELECT
USING (true);

CREATE POLICY "Users can read all events"
ON events FOR SELECT
USING (true);

COMMIT;
