import db, { initDatabase } from './db.js';

export function seedDatabase() {
  initDatabase();

  console.log('Seeding database with 5 student sample profiles for Sanjivani ERP & UMS...');

  // 1. Departments
  const deptStmt = db.prepare('INSERT OR IGNORE INTO departments (id, name, code) VALUES (?, ?, ?)');
  deptStmt.run('dept-cse', 'School of Computer Engineering & Technology', 'SCET');
  deptStmt.run('dept-mech', 'School of Mechanical Engineering', 'SME');
  deptStmt.run('dept-mgmt', 'School of Management & Business Studies', 'SMBS');

  // 2. Sample Users & Profiles (5 Students, Faculty, HOD, Admin)
  const userStmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password_hash, role, full_name, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Student 1: Yuvraj Gaikwad
  userStmt.run('u-student-1', 'yuvraj@sanjivani.edu.in', 'password123', 'Student', 'Yuvraj Gaikwad', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  // Student 2: Priya Sharma
  userStmt.run('u-student-2', 'priya@sanjivani.edu.in', 'password123', 'Student', 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80');
  // Student 3: Rohan Kulkarni
  userStmt.run('u-student-3', 'rohan@sanjivani.edu.in', 'password123', 'Student', 'Rohan Kulkarni', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80');
  // Student 4: Sneha Patil
  userStmt.run('u-student-4', 'sneha@sanjivani.edu.in', 'password123', 'Student', 'Sneha Patil', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80');
  // Student 5: Aditya Deshmukh
  userStmt.run('u-student-5', 'aditya@sanjivani.edu.in', 'password123', 'Student', 'Aditya Deshmukh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80');

  // Faculty, HOD, Admin
  userStmt.run('u-faculty-1', 'faculty@sanjivani.edu.in', 'password123', 'Faculty', 'Dr. Ananya Sharma', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80');
  userStmt.run('u-hod-1', 'hod@sanjivani.edu.in', 'password123', 'HOD', 'Prof. Rajesh Kulkarni', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80');
  userStmt.run('u-admin-1', 'admin@sanjivani.edu.in', 'password123', 'Admin', 'Sanjivani ERP Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80');

  // Student Details for all 5 sample students
  const studentStmt = db.prepare(`
    INSERT OR IGNORE INTO students (id, user_id, roll_number, prn_number, department_id, program, academic_year, year_level, semester, division, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  studentStmt.run('stu-1', 'u-student-1', '2024-CSE-042', 'SU20240901', 'dept-cse', 'B.Tech Computer Engineering', '2024-2025', 'Third Year', 'Semester 5', 'Division A', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  studentStmt.run('stu-2', 'u-student-2', '2024-CSE-018', 'SU20240902', 'dept-cse', 'B.Tech Computer Engineering', '2024-2025', 'Third Year', 'Semester 5', 'Division A', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80');
  studentStmt.run('stu-3', 'u-student-3', '2024-MECH-029', 'SU20240903', 'dept-mech', 'B.Tech Mechanical Engineering', '2024-2025', 'Third Year', 'Semester 5', 'Division B', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80');
  studentStmt.run('stu-4', 'u-student-4', '2024-MGMT-005', 'SU20240904', 'dept-mgmt', 'MBA Business Analytics', '2024-2025', 'Second Year', 'Semester 3', 'Division A', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80');
  studentStmt.run('stu-5', 'u-student-5', '2024-CSE-077', 'SU20240905', 'dept-cse', 'B.Tech Computer Engineering', '2024-2025', 'Third Year', 'Semester 5', 'Division B', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80');

  const facultyStmt = db.prepare('INSERT OR IGNORE INTO faculty (id, user_id, employee_id, department_id, designation) VALUES (?, ?, ?, ?, ?)');
  facultyStmt.run('fac-1', 'u-faculty-1', 'FAC-CSE-102', 'dept-cse', 'Associate Professor & Activity Coordinator');
  facultyStmt.run('fac-hod', 'u-hod-1', 'HOD-CSE-001', 'dept-cse', 'Head of Department & Professor');

  // 3. Activity Categories (20 categories)
  const defaultCategories = [
    { name: 'Sports', description: 'Athletic, indoor, and outdoor sports tournaments', icon: 'Trophy' },
    { name: 'Cultural Activities', description: 'Music, dance, drama, art, and festival performances', icon: 'Music' },
    { name: 'Technical Events', description: 'Tech fests, robo-wars, and engineering showcases', icon: 'Cpu' },
    { name: 'Hackathons', description: '24-48 hr hackathons and product building challenges', icon: 'Code' },
    { name: 'Coding Competitions', description: 'Competitive programming and algorithmic contests', icon: 'Terminal' },
    { name: 'Project Competitions', description: 'Hardware & software project exhibits and expos', icon: 'FolderKanban' },
    { name: 'Paper Presentation', description: 'Research paper presentations at symposia & fests', icon: 'FileText' },
    { name: 'Poster Presentation', description: 'Academic poster displays and research presentations', icon: 'Layout' },
    { name: 'Workshops', description: 'Skill-building hands-on workshops and training sessions', icon: 'Wrench' },
    { name: 'Seminars', description: 'Expert guest lectures and subject matter seminars', icon: 'Presentation' },
    { name: 'Conferences', description: 'National and international academic conferences', icon: 'Globe' },
    { name: 'Certifications', description: 'NPTEL, Coursera, AWS, and industry certifications', icon: 'Award' },
    { name: 'Internships', description: 'Summer/Winter industry internships and apprenticeships', icon: 'Briefcase' },
    { name: 'Industrial Visits', description: 'Study tours and manufacturing plant visits', icon: 'Building' },
    { name: 'NSS/Social Activities', description: 'Community service, blood donation, environmental drives', icon: 'HeartHandshake' },
    { name: 'Club Activities', description: 'Student club organizing and active participation', icon: 'Users' },
    { name: 'Entrepreneurship', description: 'Startups, E-Cell activities, and business plan pitches', icon: 'Rocket' },
    { name: 'Leadership Activities', description: 'Student council, event head, class representative duties', icon: 'Crown' },
    { name: 'Volunteering', description: 'Volunteering for university events and social causes', icon: 'HandHeart' },
    { name: 'Other', description: 'Miscellaneous co-curricular & extra-curricular events', icon: 'Sparkles' }
  ];

  const catStmt = db.prepare('INSERT OR IGNORE INTO activity_categories (name, description, icon) VALUES (?, ?, ?)');
  defaultCategories.forEach(cat => catStmt.run(cat.name, cat.description, cat.icon));

  // 4. Achievement Levels
  const defaultLevels = [
    { name: 'Department Level', sort_order: 1 },
    { name: 'College/Institute Level', sort_order: 2 },
    { name: 'University Level', sort_order: 3 },
    { name: 'District Level', sort_order: 4 },
    { name: 'State Level', sort_order: 5 },
    { name: 'National Level', sort_order: 6 },
    { name: 'International Level', sort_order: 7 }
  ];
  const levelStmt = db.prepare('INSERT OR IGNORE INTO activity_levels (name, sort_order) VALUES (?, ?)');
  defaultLevels.forEach(lvl => levelStmt.run(lvl.name, lvl.sort_order));

  // 5. Point Matrix
  const pointMatrix = [
    { level_name: 'Department Level', activity_type: 'Participation', points: 5 },
    { level_name: 'College/Institute Level', activity_type: 'Participation', points: 5 },
    { level_name: 'University Level', activity_type: 'Participation', points: 10 },
    { level_name: 'District Level', activity_type: 'Participation', points: 15 },
    { level_name: 'State Level', activity_type: 'Participation', points: 20 },
    { level_name: 'National Level', activity_type: 'Participation', points: 30 },
    { level_name: 'International Level', activity_type: 'Participation', points: 40 },
    { level_name: 'Department Level', activity_type: 'Achievement', points: 10 },
    { level_name: 'College/Institute Level', activity_type: 'Achievement', points: 10 },
    { level_name: 'University Level', activity_type: 'Achievement', points: 20 },
    { level_name: 'District Level', activity_type: 'Achievement', points: 25 },
    { level_name: 'State Level', activity_type: 'Achievement', points: 30 },
    { level_name: 'National Level', activity_type: 'Achievement', points: 40 },
    { level_name: 'International Level', activity_type: 'Achievement', points: 50 }
  ];

  const pointStmt = db.prepare('INSERT OR REPLACE INTO activity_points_config (level_name, activity_type, points) VALUES (?, ?, ?)');
  pointMatrix.forEach(p => pointStmt.run(p.level_name, p.activity_type, p.points));

  // 6. Thresholds
  const thresholds = [
    { level_name: 'Outstanding', min_percentage: 90, max_percentage: 100, color_code: '#10b981' },
    { level_name: 'Excellent', min_percentage: 75, max_percentage: 89, color_code: '#3b82f6' },
    { level_name: 'Very Good', min_percentage: 60, max_percentage: 74, color_code: '#6366f1' },
    { level_name: 'Good', min_percentage: 45, max_percentage: 59, color_code: '#f59e0b' },
    { level_name: 'Developing', min_percentage: 0, max_percentage: 44, color_code: '#ef4444' }
  ];
  const threshStmt = db.prepare('INSERT OR REPLACE INTO performance_thresholds (level_name, min_percentage, max_percentage, color_code) VALUES (?, ?, ?, ?)');
  thresholds.forEach(t => threshStmt.run(t.level_name, t.min_percentage, t.max_percentage, t.color_code));

  const getCatId = (name) => db.prepare('SELECT id FROM activity_categories WHERE name = ?').get(name)?.id;
  const getLvlId = (name) => db.prepare('SELECT id FROM activity_levels WHERE name = ?').get(name)?.id;

  // 7. Extra-Curricular Activities for all 5 sample students
  const actStmt = db.prepare(`
    INSERT OR IGNORE INTO student_activities (
      id, student_id, activity_name, category_id, activity_type, description,
      participation_date, academic_year, semester, organizing_institution, level_id,
      position_achievement, certificate_number, skills_developed, faculty_coordinator,
      verification_status, faculty_remarks, calculated_points, awarded_points,
      verifier_id, verified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Student 1: Yuvraj Gaikwad (120 pts)
  actStmt.run('act-1', 'stu-1', 'National Smart India Hackathon 2024', getCatId('Hackathons'), 'Achievement', 'AI smart irrigation project', '2024-11-15', '2024-2025', 'Semester 5', 'Ministry of Education & AICTE', getLvlId('National Level'), '1st Runner Up', 'SIH-2024-894', 'React, Node, TensorFlow', 'Dr. Ananya Sharma', 'Approved', 'Outstanding national performance.', 40, 40, 'fac-1', '2024-11-20');
  actStmt.run('act-2', 'stu-1', 'AWS Certified Solutions Architect', getCatId('Certifications'), 'Achievement', 'Cloud computing certification', '2024-10-05', '2024-2025', 'Semester 5', 'AWS', getLvlId('International Level'), 'Passed with Distinction', 'AWS-998241', 'AWS EC2, S3, IAM', 'Prof. Rajesh Kulkarni', 'Approved', 'Distinguished industry cert.', 50, 50, 'fac-1', '2024-10-10');
  actStmt.run('act-3', 'stu-1', 'Inter-University Cricket Championship', getCatId('Sports'), 'Achievement', 'University team captain', '2024-09-12', '2024-2025', 'Semester 5', 'AIU', getLvlId('State Level'), 'Team Captain & Winner', 'AIU-CRIC-04', 'Leadership, Sportsmanship', 'Dr. S. P. Patil', 'Approved', 'State trophy winner.', 30, 30, 'fac-1', '2024-09-18');

  // Student 2: Priya Sharma (150 pts - Outstanding)
  actStmt.run('act-4', 'stu-2', 'ACM International Collegiate Coding Contest', getCatId('Coding Competitions'), 'Achievement', 'Solves 8/8 algorithmic challenges in 3 hrs', '2024-11-02', '2024-2025', 'Semester 5', 'ACM India', getLvlId('International Level'), '1st Rank Global Winner', 'ACM-2024-011', 'Algorithms, C++, Dynamic Programming', 'Dr. Ananya Sharma', 'Approved', 'Exceptional global coding achievement!', 50, 50, 'fac-1', '2024-11-05');
  actStmt.run('act-5', 'stu-2', 'IEEE International Conference Paper', getCatId('Paper Presentation'), 'Achievement', 'Published paper on Cyber Security & Blockchain', '2024-10-18', '2024-2025', 'Semester 5', 'IEEE Computer Society', getLvlId('International Level'), 'Best Research Paper Award', 'IEEE-PAP-992', 'Blockchain, Cryptography', 'Dr. Ananya Sharma', 'Approved', 'Superb IEEE publication.', 50, 50, 'fac-1', '2024-10-22');
  actStmt.run('act-6', 'stu-2', 'NPTEL Machine Learning Gold Medal', getCatId('Certifications'), 'Achievement', 'Scored 94% top 1% national rank in IIT Madras course', '2024-09-25', '2024-2025', 'Semester 5', 'IIT Madras & NPTEL', getLvlId('National Level'), 'Gold Medal + Top 1% Topper', 'NPTEL-ML-2024', 'Machine Learning, Python', 'Prof. Rajesh Kulkarni', 'Approved', 'Top national rank.', 40, 50, 'fac-1', '2024-09-28');

  // Student 3: Rohan Kulkarni (95 pts - Excellent)
  actStmt.run('act-7', 'stu-3', 'BAJA SAE India Formula Racing', getCatId('Project Competitions'), 'Achievement', 'Designed and fabricated All-Terrain Vehicle chassis', '2024-10-12', '2024-2025', 'Semester 5', 'SAE India', getLvlId('National Level'), 'Team Vehicle Lead & 2nd Rank', 'SAE-BAJA-88', 'CAD SolidWorks, Welding, Suspension', 'Prof. M. B. Joshi', 'Approved', 'Great mechanical engineering project.', 40, 40, 'fac-1', '2024-10-15');
  actStmt.run('act-8', 'stu-3', 'National Robotics Championship', getCatId('Technical Events'), 'Achievement', 'Built autonomous obstacle avoiding rover bot', '2024-08-30', '2024-2025', 'Semester 5', 'IIT Bombay TechFest', getLvlId('National Level'), 'Finalist Runner Up', 'IITB-ROBO-102', 'Robotics, Microcontrollers, Mechatronics', 'Dr. Ananya Sharma', 'Approved', 'National robotics rank.', 40, 40, 'fac-1', '2024-09-02');
  actStmt.run('act-9', 'stu-3', 'Industrial Visit - Tata Motors Manufacturing', getCatId('Industrial Visits'), 'Participation', 'Study tour of vehicle assembly line', '2024-07-15', '2024-2025', 'Semester 5', 'Tata Motors Pune', getLvlId('State Level'), 'Student Coordinator', 'IV-TATA-2024', 'Manufacturing, Industrial Automation', 'Prof. M. B. Joshi', 'Approved', 'Active study tour.', 15, 15, 'fac-1', '2024-07-20');

  // Student 4: Sneha Patil (110 pts - Outstanding MBA)
  actStmt.run('act-10', 'stu-4', 'National B-Plan Business Pitch Contest', getCatId('Entrepreneurship'), 'Achievement', 'Pitched FinTech startup model for rural credit scoring', '2024-11-10', '2024-2025', 'Semester 3', 'IIM Ahmedabad E-Cell', getLvlId('National Level'), '1st Prize Winner (Rs. 1 Lakh Seed Fund)', 'IIMA-BPLAN-09', 'Business Models, Pitching, Finance', 'Prof. Rajesh Kulkarni', 'Approved', 'Outstanding business pitch.', 40, 40, 'fac-1', '2024-11-14');
  actStmt.run('act-11', 'stu-4', 'Sanjivani E-Cell Vice President', getCatId('Leadership Activities'), 'Achievement', 'Managed 12 startup workshops and incubator pitches', '2024-09-01', '2024-2025', 'Semester 3', 'Sanjivani E-Cell', getLvlId('University Level'), 'E-Cell Vice President', 'SU-ECell-2024', 'Leadership, Entrepreneurship', 'Prof. Rajesh Kulkarni', 'Approved', 'Great leadership.', 20, 20, 'fac-1', '2024-09-05');
  actStmt.run('act-12', 'stu-4', 'NSS Mega Health & Blood Camp Lead', getCatId('NSS/Social Activities'), 'Achievement', 'Organized 500+ unit blood donation drive', '2024-08-10', '2024-2025', 'Semester 3', 'NSS Maharashtra', getLvlId('State Level'), 'Chief Student Organizer', 'NSS-STATE-77', 'Social Responsibility, Event Management', 'Dr. S. P. Patil', 'Approved', 'Remarkable community drive.', 30, 50, 'fac-1', '2024-08-15');

  // Student 5: Aditya Deshmukh (35 pts - Developing)
  actStmt.run('act-13', 'stu-5', 'Inter-College One-Act Drama Play', getCatId('Cultural Activities'), 'Achievement', 'Lead actor in street play on environmental awareness', '2024-09-20', '2024-2025', 'Semester 5', 'SPPU Youth Fest', getLvlId('District Level'), '2nd Best Actor Award', 'SPPU-ACT-12', 'Acting, Stage Presence, Public Speaking', 'Dr. Ananya Sharma', 'Approved', 'Good drama performance.', 25, 25, 'fac-1', '2024-09-25');
  actStmt.run('act-14', 'stu-5', 'College Cultural Fest Volunteer', getCatId('Volunteering'), 'Participation', 'Stage management & crowd control volunteer', '2024-08-18', '2024-2025', 'Semester 5', 'Sanjivani University', getLvlId('College/Institute Level'), 'Volunteer', 'SU-FEST-2024', 'Volunteering, Logistics', 'Dr. Ananya Sharma', 'Approved', 'Volunteer participation.', 10, 10, 'fac-1', '2024-08-22');

  // 8. Courses & Attendance for all 5 sample students
  const crsStmt = db.prepare('INSERT OR IGNORE INTO student_courses (id, student_id, course_code, course_name, credits, course_type, faculty_name) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const attStmt = db.prepare('INSERT OR IGNORE INTO student_attendance (id, student_id, course_code, course_name, total_conducted, total_attended) VALUES (?, ?, ?, ?, ?, ?)');
  const feeStmt = db.prepare('INSERT OR IGNORE INTO student_fees (id, student_id, academic_year, tuition_fee, development_fee, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const grdStmt = db.prepare('INSERT OR IGNORE INTO student_grades (id, student_id, semester, course_code, course_name, internal_marks, end_sem_marks, grade, sgpa, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  // Courses & Attendance Data
  const courseData = [
    { code: 'CS501', name: 'Database Management Systems', credits: 4, type: 'Theory', faculty: 'Dr. Ananya Sharma' },
    { code: 'CS502', name: 'Software Engineering & Agile', credits: 3, type: 'Theory', faculty: 'Prof. Rajesh Kulkarni' },
    { code: 'CS503', name: 'Artificial Intelligence & ML', credits: 4, type: 'Theory', faculty: 'Dr. S. K. Mahajan' },
    { code: 'CS504', name: 'Computer Networks & Security', credits: 4, type: 'Theory', faculty: 'Prof. M. B. Joshi' },
    { code: 'CS505L', name: 'Web Development & Cloud Lab', credits: 2, type: 'Practical', faculty: 'Prof. P. V. Shinde' }
  ];

  // Populate UMS datasets per student
  const studentsList = [
    { id: 'stu-1', attMult: 0.90, feePaid: 130000, feeStatus: 'Paid in Full', sgpa: 9.10, cgpa: 8.82 },
    { id: 'stu-2', attMult: 0.96, feePaid: 130000, feeStatus: 'Paid in Full', sgpa: 9.60, cgpa: 9.45 },
    { id: 'stu-3', attMult: 0.78, feePaid: 90000, feeStatus: 'Partially Paid (Rs 40k Due)', sgpa: 8.10, cgpa: 7.92 },
    { id: 'stu-4', attMult: 0.92, feePaid: 150000, feeStatus: 'Paid in Full', sgpa: 9.00, cgpa: 8.90 },
    { id: 'stu-5', attMult: 0.72, feePaid: 70000, feeStatus: 'Defaulter (Rs 60k Due)', sgpa: 7.00, cgpa: 6.85 }
  ];

  studentsList.forEach(s => {
    courseData.forEach((c, idx) => {
      crsStmt.run(`crs-${s.id}-${idx}`, s.id, c.code, c.name, c.credits, c.type, c.faculty);
      const conducted = 40;
      const attended = Math.round(conducted * s.attMult);
      attStmt.run(`att-${s.id}-${idx}`, s.id, c.code, c.name, conducted, attended);
    });

    feeStmt.run(`fee-${s.id}`, s.id, '2024-2025', 115000, 15000, s.feePaid, s.feeStatus);
    grdStmt.run(`grd-${s.id}-1`, s.id, 'Semester 4', 'CS401', 'Core Course 1', 28, 62, s.cgpa >= 8.5 ? 'O' : 'A+', s.sgpa, s.cgpa);
    grdStmt.run(`grd-${s.id}-2`, s.id, 'Semester 4', 'CS402', 'Core Course 2', 26, 58, s.cgpa >= 8.5 ? 'A+' : 'A', s.sgpa, s.cgpa);
  });

  // Timetable
  const ttStmt = db.prepare('INSERT OR IGNORE INTO student_timetable (id, student_id, day_of_week, time_slot, course_code, course_name, room_number, faculty_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  studentsList.forEach(s => {
    ttStmt.run(`tt-${s.id}-1`, s.id, 'Monday', '09:15 AM - 10:15 AM', 'CS501', 'Database Management Systems', 'Lab 302', 'Dr. Ananya Sharma');
    ttStmt.run(`tt-${s.id}-2`, s.id, 'Monday', '10:15 AM - 11:15 AM', 'CS503', 'Artificial Intelligence & ML', 'Classroom 405', 'Dr. S. K. Mahajan');
    ttStmt.run(`tt-${s.id}-3`, s.id, 'Tuesday', '09:15 AM - 11:15 AM', 'CS505L', 'Web Development Lab', 'CC-Lab 02', 'Prof. P. V. Shinde');
  });

  // University Notices
  const noticeStmt = db.prepare('INSERT OR IGNORE INTO university_notices (id, title, category, notice_date, content, is_important) VALUES (?, ?, ?, ?, ?, ?)');
  noticeStmt.run('not-1', 'Schedule for End-Semester Mid-Term Examinations (Sem 5)', 'Exam', '2024-12-01', 'Mid-Term Examinations for B.Tech Semester 5 will commence from 15th December 2024.', 1);
  noticeStmt.run('not-2', 'Felicitation of Smart India Hackathon & ACM Coding Winners', 'Academic', '2024-11-22', 'Sanjivani University congratulates team leads Yuvraj Gaikwad and Priya Sharma.', 1);
  noticeStmt.run('not-3', 'Registration Open for Sanjivani Annual Sports & TechFest 2025', 'General', '2024-11-10', 'Students can register through the Student ERP portal extra-curricular module.', 0);

  console.log('Database seeded successfully with 5 student sample profiles!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
