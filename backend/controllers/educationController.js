const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Exam = require('../models/Exam');
const Attendance = require('../models/Attendance');

// @desc    Get all students
// @route   GET /api/education/students
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ company: req.company._id });
  res.json(students);
});

// @desc    Add new student
// @route   POST /api/education/students
const addStudent = asyncHandler(async (req, res) => {
  const student = await Student.create({ ...req.body, company: req.company._id });
  res.status(201).json(student);
});

// @desc    Get all courses
// @route   GET /api/education/courses
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ company: req.company._id });
  res.json(courses);
});

// @desc    Add new course
// @route   POST /api/education/courses
const addCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, company: req.company._id });
  res.status(201).json(course);
});

// Teachers
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({ company: req.company._id });
  res.json(teachers);
});

const addTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.create({ ...req.body, company: req.company._id });
  res.status(201).json(teacher);
});

// Exams
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ company: req.company._id }).populate('course', 'title');
  res.json(exams);
});

const addExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create({ ...req.body, company: req.company._id });
  const populated = await Exam.findById(exam._id).populate('course', 'title');
  res.status(201).json(populated);
});

// Attendance
const getAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ company: req.company._id }).populate('student', 'name rollNumber');
  res.json(attendance);
});

const addAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.create({ ...req.body, company: req.company._id });
  const populated = await Attendance.findById(record._id).populate('student', 'name rollNumber');
  res.status(201).json(populated);
});

module.exports = { 
  getStudents, addStudent, 
  getCourses, addCourse,
  getTeachers, addTeacher,
  getExams, addExam,
  getAttendance, addAttendance
};