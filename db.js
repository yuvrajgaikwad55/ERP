import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'sanjivani_erp.json');

class PureJSDB {
  constructor() {
    this.tables = {
      departments: [],
      users: [],
      students: [],
      faculty: [],
      activity_categories: [],
      activity_levels: [],
      activity_points_config: [],
      performance_thresholds: [],
      student_activities: [],
      activity_documents: [],
      activity_reports: [],
      student_courses: [],
      student_attendance: [],
      student_fees: [],
      student_grades: [],
      student_timetable: [],
      university_notices: []
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    if (fs.existsSync(dbFilePath)) {
      try {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.tables = { ...this.tables, ...JSON.parse(raw) };
      } catch (err) {
        console.error('Error loading db file, initializing new state:', err);
      }
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.tables, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving db file to disk:', err);
    }
  }

  pragma() {}
  exec() { this.saveToDisk(); }

  prepare(sql) {
    const dbInstance = this;
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    return {
      all(...params) {
        return dbInstance.executeQuery(cleanSql, params, 'all');
      },
      get(...params) {
        const res = dbInstance.executeQuery(cleanSql, params, 'all');
        return res && res.length > 0 ? res[0] : undefined;
      },
      run(...params) {
        dbInstance.executeQuery(cleanSql, params, 'run');
        dbInstance.saveToDisk();
        return { changes: 1 };
      }
    };
  }

  executeQuery(sql, params, mode) {
    const isInsert = sql.toUpperCase().startsWith('INSERT');
    const isUpdate = sql.toUpperCase().startsWith('UPDATE');
    const isDelete = sql.toUpperCase().startsWith('DELETE');
    const isSelect = sql.toUpperCase().startsWith('SELECT');

    if (isInsert) {
      if (sql.includes('departments')) {
        const [id, name, code] = params;
        if (!this.tables.departments.some(d => d.id === id || d.code === code)) {
          this.tables.departments.push({ id, name, code });
        }
      } else if (sql.includes('users')) {
        const [id, email, password_hash, role, full_name, avatar_url] = params;
        if (!this.tables.users.some(u => u.id === id || u.email === email)) {
          this.tables.users.push({ id, email, password_hash, role, full_name, avatar_url, created_at: new Date().toISOString() });
        }
      } else if (sql.includes('students')) {
        const [id, user_id, roll_number, prn_number, department_id, program, academic_year, year_level, semester, division, photo_url] = params;
        if (!this.tables.students.some(s => s.id === id)) {
          this.tables.students.push({ id, user_id, roll_number, prn_number, department_id, program, academic_year, year_level, semester, division, photo_url });
        }
      } else if (sql.includes('faculty')) {
        const [id, user_id, employee_id, department_id, designation] = params;
        if (!this.tables.faculty.some(f => f.id === id)) {
          this.tables.faculty.push({ id, user_id, employee_id, department_id, designation });
        }
      } else if (sql.includes('activity_categories')) {
        const [name, description, icon, is_active = 1] = params;
        const existing = this.tables.activity_categories.find(c => c.name === name);
        if (!existing) {
          const id = this.tables.activity_categories.length + 1;
          this.tables.activity_categories.push({ id, name, description, icon, is_active, created_at: new Date().toISOString() });
        }
      } else if (sql.includes('activity_levels')) {
        const [name, sort_order] = params;
        if (!this.tables.activity_levels.some(l => l.name === name)) {
          const id = this.tables.activity_levels.length + 1;
          this.tables.activity_levels.push({ id, name, sort_order });
        }
      } else if (sql.includes('activity_points_config')) {
        const [level_name, activity_type, points] = params;
        const idx = this.tables.activity_points_config.findIndex(p => p.level_name === level_name && p.activity_type === activity_type);
        if (idx >= 0) {
          this.tables.activity_points_config[idx].points = parseInt(points);
        } else {
          this.tables.activity_points_config.push({ id: this.tables.activity_points_config.length + 1, level_name, activity_type, points: parseInt(points) });
        }
      } else if (sql.includes('performance_thresholds')) {
        const [level_name, min_percentage, max_percentage, color_code] = params;
        const idx = this.tables.performance_thresholds.findIndex(t => t.level_name === level_name);
        if (idx >= 0) {
          this.tables.performance_thresholds[idx] = { id: this.tables.performance_thresholds[idx].id, level_name, min_percentage, max_percentage, color_code };
        } else {
          this.tables.performance_thresholds.push({ id: this.tables.performance_thresholds.length + 1, level_name, min_percentage, max_percentage, color_code });
        }
      } else if (sql.includes('student_activities')) {
        const [
          id, student_id, activity_name, category_id, activity_type, description,
          participation_date, academic_year, semester, organizing_institution, level_id,
          position_achievement, certificate_number, skills_developed, faculty_coordinator,
          verification_status, calculated_points, awarded_points, verifier_id, verified_at
        ] = params;
        if (!this.tables.student_activities.some(a => a.id === id)) {
          this.tables.student_activities.push({
            id, student_id, activity_name, category_id: parseInt(category_id), activity_type, description,
            participation_date, academic_year, semester, organizing_institution, level_id: parseInt(level_id),
            position_achievement, certificate_number, skills_developed, faculty_coordinator,
            verification_status, faculty_remarks: null, calculated_points: parseInt(calculated_points || 0), awarded_points: parseInt(awarded_points || 0),
            verifier_id: verifier_id || null, verified_at: verified_at || null, created_at: new Date().toISOString()
          });
        }
      } else if (sql.includes('activity_documents')) {
        const [id, activity_id, file_name, file_path, file_type, file_size] = params;
        this.tables.activity_documents.push({ id, activity_id, file_name, file_path, file_type, file_size, uploaded_at: new Date().toISOString() });
      } else if (sql.includes('activity_reports')) {
        const [
          id, student_id, academic_year, semester, total_activities, total_points,
          performance_level, performance_percentage, system_remark, faculty_remark,
          status, qr_code_hash
        ] = params;
        this.tables.activity_reports.push({
          id, student_id, academic_year, semester, total_activities, total_points,
          performance_level, performance_percentage, system_remark, faculty_remark,
          status, qr_code_hash, created_at: new Date().toISOString()
        });
      } else if (sql.includes('student_courses')) {
        const [id, student_id, course_code, course_name, credits, course_type, faculty_name] = params;
        if (!this.tables.student_courses.some(c => c.id === id)) {
          this.tables.student_courses.push({ id, student_id, course_code, course_name, credits: parseInt(credits), course_type, faculty_name });
        }
      } else if (sql.includes('student_attendance')) {
        const [id, student_id, course_code, course_name, total_conducted, total_attended] = params;
        const percentage = Math.round((parseInt(total_attended) / parseInt(total_conducted)) * 100);
        if (!this.tables.student_attendance.some(a => a.id === id)) {
          this.tables.student_attendance.push({ id, student_id, course_code, course_name, total_conducted: parseInt(total_conducted), total_attended: parseInt(total_attended), percentage });
        }
      } else if (sql.includes('student_fees')) {
        const [id, student_id, academic_year, tuition_fee, development_fee, amount_paid, payment_status] = params;
        const total = parseInt(tuition_fee) + parseInt(development_fee);
        const balance = total - parseInt(amount_paid);
        if (!this.tables.student_fees.some(f => f.id === id)) {
          this.tables.student_fees.push({ id, student_id, academic_year, tuition_fee: parseInt(tuition_fee), development_fee: parseInt(development_fee), total_fee: total, amount_paid: parseInt(amount_paid), balance_due: balance, payment_status });
        }
      } else if (sql.includes('student_grades')) {
        const [id, student_id, semester, course_code, course_name, internal_marks, end_sem_marks, grade, sgpa, cgpa] = params;
        if (!this.tables.student_grades.some(g => g.id === id)) {
          this.tables.student_grades.push({ id, student_id, semester, course_code, course_name, internal_marks: parseInt(internal_marks), end_sem_marks: parseInt(end_sem_marks), total_marks: parseInt(internal_marks) + parseInt(end_sem_marks), grade, sgpa: parseFloat(sgpa), cgpa: parseFloat(cgpa) });
        }
      } else if (sql.includes('student_timetable')) {
        const [id, student_id, day_of_week, time_slot, course_code, course_name, room_number, faculty_name] = params;
        if (!this.tables.student_timetable.some(t => t.id === id)) {
          this.tables.student_timetable.push({ id, student_id, day_of_week, time_slot, course_code, course_name, room_number, faculty_name });
        }
      } else if (sql.includes('university_notices')) {
        const [id, title, category, notice_date, content, is_important] = params;
        if (!this.tables.university_notices.some(n => n.id === id)) {
          this.tables.university_notices.push({ id, title, category, notice_date, content, is_important: is_important ? 1 : 0 });
        }
      }
      return [];
    }

    if (isUpdate) {
      if (sql.includes('student_activities')) {
        const [verification_status, faculty_remarks, awarded_points, verifier_id, id] = params;
        const act = this.tables.student_activities.find(a => a.id === id);
        if (act) {
          act.verification_status = verification_status;
          act.faculty_remarks = faculty_remarks;
          act.awarded_points = parseInt(awarded_points || 0);
          act.verifier_id = verifier_id;
          act.verified_at = new Date().toISOString();
        }
      }
      return [];
    }

    if (isSelect) {
      if (sql.includes('FROM student_courses')) {
        return [...this.tables.student_courses];
      }
      if (sql.includes('FROM student_attendance')) {
        return [...this.tables.student_attendance];
      }
      if (sql.includes('FROM student_fees')) {
        return [...this.tables.student_fees];
      }
      if (sql.includes('FROM student_grades')) {
        return [...this.tables.student_grades];
      }
      if (sql.includes('FROM student_timetable')) {
        return [...this.tables.student_timetable];
      }
      if (sql.includes('FROM university_notices')) {
        return [...this.tables.university_notices].sort((a, b) => new Date(b.notice_date) - new Date(a.notice_date));
      }

      if (sql.includes('FROM student_activities a')) {
        let results = this.tables.student_activities.map(act => {
          const cat = this.tables.activity_categories.find(c => c.id === act.category_id) || {};
          const lvl = this.tables.activity_levels.find(l => l.id === act.level_id) || {};
          const stu = this.tables.students.find(s => s.id === act.student_id) || {};
          const usr = this.tables.users.find(u => u.id === stu.user_id) || {};
          const dept = this.tables.departments.find(d => d.id === stu.department_id) || {};
          const doc = this.tables.activity_documents.find(d => d.activity_id === act.id) || {};

          return {
            ...act,
            category_name: cat.name || 'Other',
            category_icon: cat.icon || 'Activity',
            level_name: lvl.name || 'College Level',
            roll_number: stu.roll_number || '2024-CSE-042',
            prn_number: stu.prn_number || 'SU20240901',
            program: stu.program || 'B.Tech Computer Engineering',
            year_level: stu.year_level || 'Third Year',
            division: stu.division || 'A',
            student_name: usr.full_name || 'Yuvraj Gaikwad',
            student_avatar: usr.avatar_url,
            department_name: dept.name || 'SCET',
            department_id: stu.department_id,
            document_path: doc.file_path || null,
            document_name: doc.file_name || null
          };
        });

        let paramIdx = 0;
        if (sql.includes('a.student_id = ?') && params[paramIdx]) {
          results = results.filter(r => r.student_id === params[paramIdx]);
          paramIdx++;
        }
        if (sql.includes('a.verification_status = ?') && params[paramIdx]) {
          results = results.filter(r => r.verification_status === params[paramIdx]);
          paramIdx++;
        }
        if (sql.includes('a.academic_year = ?') && params[paramIdx]) {
          results = results.filter(r => r.academic_year === params[paramIdx]);
          paramIdx++;
        }
        if (sql.includes('WHERE a.id = ?')) {
          results = results.filter(r => r.id === params[0]);
        }

        return results;
      }

      if (sql.includes('FROM activity_categories')) {
        return [...this.tables.activity_categories];
      }

      if (sql.includes('FROM activity_levels')) {
        return [...this.tables.activity_levels];
      }

      if (sql.includes('FROM activity_points_config')) {
        return [...this.tables.activity_points_config];
      }

      if (sql.includes('FROM performance_thresholds')) {
        return [...this.tables.performance_thresholds].sort((a, b) => b.min_percentage - a.min_percentage);
      }

      if (sql.includes('FROM students s')) {
        const studentId = params[0];
        const stu = this.tables.students.find(s => s.id === studentId);
        if (!stu) return [];
        const usr = this.tables.users.find(u => u.id === stu.user_id) || {};
        const dept = this.tables.departments.find(d => d.id === stu.department_id) || {};
        return [{
          ...stu,
          full_name: usr.full_name,
          email: usr.email,
          avatar_url: usr.avatar_url,
          department_name: dept.name
        }];
      }

      if (sql.includes('FROM users u')) {
        return this.tables.users.map(u => {
          const stu = this.tables.students.find(s => s.user_id === u.id);
          const fac = this.tables.faculty.find(f => f.user_id === u.id);
          const deptId = stu?.department_id || fac?.department_id;
          const dept = this.tables.departments.find(d => d.id === deptId);

          return {
            ...u,
            student_id: stu?.id,
            faculty_id: fac?.id,
            roll_number: stu?.roll_number,
            prn_number: stu?.prn_number,
            program: stu?.program,
            year_level: stu?.year_level,
            semester: stu?.semester,
            division: stu?.division,
            department_name: dept?.name
          };
        });
      }
    }

    return [];
  }
}

const db = new PureJSDB();

export function initDatabase() {
  console.log('Pure JS persistent database with UMS schemas loaded successfully.');
}

export default db;
