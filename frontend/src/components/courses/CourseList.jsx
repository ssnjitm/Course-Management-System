import { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import CourseCard from './CourseCard.jsx';
import CourseForm from './CourseFrom.jsx';
import Button from '../ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, teachersData] = await Promise.all([
        api.getCourses(),
        api.getTeachers()
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await api.deleteCourse(id);
      setCourses(courses.filter(course => course._id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  const handleFormSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        const updatedCourse = await api.updateCourse(editingCourse._id, courseData);
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? updatedCourse : course
        ));
      } else {
        const newCourse = await api.createCourse(courseData);
        setCourses([...courses, newCourse]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Course Management</h2>
            <p className="text-sm text-gray-600">
              {courses.length} course{courses.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button onClick={handleCreate}>
            <i className="fas fa-plus-circle mr-2"></i> Add New Course
          </Button>
        </CardHeader>
      </Card>

      {showForm && (
        <CourseForm
          course={editingCourse}
          teachers={teachers}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {courses.length === 0 && !showForm && (
        <Card>
          <CardBody className="text-center py-12">
            <i className="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No courses found. Create your first course!</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create Course
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CourseList;