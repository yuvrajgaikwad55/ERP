import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import db from './db.js';
import { seedDatabase } from './seed.js';

import { 
  getActivities, 
  getActivityById, 
  createActivity, 
  verifyActivity, 
  uploadActivityProof 
} from './controllers/activityController.js';

import { 
  getStudentPerformanceData, 
  generateReportRecord, 
  updateReportApproval, 
  downloadReportPDF 
} from './controllers/reportController.js';

import { 
  getAnalyticsData, 
  exportActivitiesCSV 
} from './controllers/analyticsController.js';

import { 
  getCategories, 
  saveCategory, 
  savePointConfig, 
  saveThreshold 
} from './controllers/adminController.js';

import {
  getUmsDashboardData,
  getUmsCourses,
  getUmsAttendance,
  getUmsFees,
  getUmsGrades,
  getUmsTimetable,
  getUmsNotices
} from './controllers/umsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

seedDatabase();

// --- API ROUTES ---

// 1. Auth & Sample Students API
app.get('/api/students/sample', (req, res) => {
  const students = db.prepare(`
    SELECT s.id as student_id, s.roll_number, s.prn_number, s.program, s.year_level, s.semester, s.division, u.full_name, u.email, u.avatar_url, d.name as department_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN departments d ON s.department_id = d.id
    ORDER BY s.roll_number ASC
  `).all();
  res.json({ success: true, students });
});

app.get('/api/users/current', (req, res) => {
  const role = req.headers['x-user-role'] || 'Student';
  const targetStudentId = req.headers['x-student-id'] || req.query.studentId || 'stu-1';
  
  let userRow;
  if (role === 'Faculty') {
    userRow = db.prepare('SELECT u.*, f.id as faculty_id, f.employee_id, d.name as department_name FROM users u JOIN faculty f ON f.user_id = u.id JOIN departments d ON f.department_id = d.id WHERE u.role = "Faculty"').get();
  } else if (role === 'HOD') {
    userRow = db.prepare('SELECT u.*, f.id as faculty_id, f.employee_id, d.name as department_name FROM users u JOIN faculty f ON f.user_id = u.id JOIN departments d ON f.department_id = d.id WHERE u.role = "HOD"').get();
  } else if (role === 'Admin') {
    userRow = db.prepare('SELECT u.* FROM users u WHERE u.role = "Admin"').get();
  } else {
    userRow = db.prepare('SELECT u.*, s.id as student_id, s.roll_number, s.prn_number, s.program, s.year_level, s.semester, s.division, d.name as department_name FROM users u JOIN students s ON s.user_id = u.id JOIN departments d ON s.department_id = d.id WHERE s.id = ?').get(targetStudentId);
  }

  res.json({ success: true, user: userRow });
});

// 2. Extra-Curricular Student Activities Routes
app.get('/api/activities', getActivities);
app.get('/api/activities/:id', getActivityById);
app.post('/api/activities', upload.single('proof_document'), createActivity);
app.put('/api/activities/:id/verify', verifyActivity);
app.post('/api/activities/:id/upload', upload.single('proof_document'), uploadActivityProof);

// 3. Performance & Report Card Routes
app.get('/api/reports/performance', getStudentPerformanceData);
app.post('/api/reports/generate', generateReportRecord);
app.put('/api/reports/:id/approval', updateReportApproval);
app.get('/api/reports/pdf', downloadReportPDF);

// 4. Analytics & CSV Export Routes
app.get('/api/analytics', getAnalyticsData);
app.get('/api/analytics/export/csv', exportActivitiesCSV);

// 5. Admin Configuration Routes
app.get('/api/admin/config', getCategories);
app.post('/api/admin/categories', saveCategory);
app.post('/api/admin/points-config', savePointConfig);
app.post('/api/admin/thresholds', saveThreshold);

// 6. UMS Authentic Portal Routes
app.get('/api/ums/dashboard', getUmsDashboardData);
app.get('/api/ums/courses', getUmsCourses);
app.get('/api/ums/attendance', getUmsAttendance);
app.get('/api/ums/fees', getUmsFees);
app.get('/api/ums/grades', getUmsGrades);
app.get('/api/ums/timetable', getUmsTimetable);
app.get('/api/ums/notices', getUmsNotices);

app.listen(PORT, () => {
  console.log(`🚀 Sanjivani ERP & UMS Backend Server running on http://localhost:${PORT}`);
});
