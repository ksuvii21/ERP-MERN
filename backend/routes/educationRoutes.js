const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getStudents, addStudent, 
  getCourses, addCourse,
  getTeachers, addTeacher,
  getExams, addExam,
  getAttendance, addAttendance
} = require('../controllers/educationController');

router.use(protect);

router.route('/students').get(getStudents).post(addStudent);
router.route('/courses').get(getCourses).post(addCourse);
router.route('/teachers').get(getTeachers).post(addTeacher);
router.route('/exams').get(getExams).post(addExam);
router.route('/attendance').get(getAttendance).post(addAttendance);

module.exports = router;