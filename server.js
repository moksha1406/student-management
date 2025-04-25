const express = require('express');
const mongoose = require('mongoose');
const Student = require('./backend/models/student');
const Course = require('./backend/models/course');

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/student')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// 📌 CREATE - Add a new course
app.post('/courses', async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.send(course);
});

// 📌 CREATE - Add a new student
app.post('/students', async (req, res) => {
    try {
      const { name, email, age, enrolledCourses } = req.body;
  
      // Validate each course ID
      const validCourseIds = enrolledCourses?.map(id => new mongoose.Types.ObjectId(id));
  
      const student = new Student({
        name,
        email,
        age,
        enrolledCourses: validCourseIds
      });
  
      await student.save();
      res.status(201).send(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  

// 📌 READ - Get all students
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// 📌 READ - Get students with course details
app.get('/students/details', async (req, res) => {
  const students = await Student.aggregate([
    {
      $lookup: {
        from: 'courses',
        localField: 'enrolledCourses',
        foreignField: '_id',
        as: 'courses'
      }
    }
  ]);
  res.send(students);
});

// 📌 UPDATE - Update student info
app.put('/students/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(student);
});

// 📌 DELETE - Remove a student
app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send({ message: 'Student deleted' });
});

// 📌 DELETE - Remove a course
app.delete('/courses/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.send({ message: 'Course deleted' });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));