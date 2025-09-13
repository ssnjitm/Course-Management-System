import { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

const AttendanceForm = ({ students, courses, selectedDate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    course: '',
    date: selectedDate,
    students: [],
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStudentStatusChange = (studentId, status) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.map(student => 
        student.id === studentId 
          ? { ...student, status }
          : student
      )
    }));
  };

  const handleStudentToggle = (student) => {
    const isSelected = formData.students.some(s => s.id === student._id);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        students: prev.students.filter(s => s.id !== student._id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        students: [...prev.students, { id: student._id, name: student.name, status: 'present' }]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.course) {
      newErrors.course = 'Course is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.students.length === 0) {
      newErrors.students = 'At least one student must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find(c => c._id === formData.course);
  const courseStudents = selectedCourse?.students || students;

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Mark Attendance
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.course ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {formData.course && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {courseStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No students enrolled in this course</p>
                ) : (
                  <div className="space-y-3">
                    {courseStudents.map(student => {
                      const isSelected = formData.students.some(s => s.id === student._id);
                      const selectedStudent = formData.students.find(s => s.id === student._id);
                      
                      return (
                        <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleStudentToggle(student)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {student.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.email}</p>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student._id, 'present')}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  selectedStudent?.status === 'present'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student._id, 'absent')}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  selectedStudent?.status === 'absent'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student._id, 'late')}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  selectedStudent?.status === 'late'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                              >
                                Late
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.students && (
                <p className="text-red-500 text-sm mt-1">{errors.students}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes about the attendance"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Mark Attendance'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AttendanceForm;
