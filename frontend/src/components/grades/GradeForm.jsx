import { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

const GradeForm = ({ grade, assignments, students, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    student: '',
    assignment: '',
    grade: '',
    feedback: '',
    gradedAt: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (grade) {
      setFormData({
        student: grade.student?._id || grade.student || '',
        assignment: grade.assignment?._id || grade.assignment || '',
        grade: grade.grade || '',
        feedback: grade.feedback || '',
        gradedAt: grade.gradedAt ? formatDateForInput(grade.gradedAt) : new Date().toISOString().split('T')[0]
      });
    }
  }, [grade]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.student) {
      newErrors.student = 'Student is required';
    }
    
    if (!formData.assignment) {
      newErrors.assignment = 'Assignment is required';
    }
    
    if (formData.grade !== '' && (isNaN(formData.grade) || formData.grade < 0)) {
      newErrors.grade = 'Grade must be a valid number';
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

  const selectedAssignment = assignments.find(a => a._id === formData.assignment);
  const maxPoints = selectedAssignment?.points || 100;

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {grade ? 'Edit Grade' : 'Add Grade'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.student ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
              {errors.student && (
                <p className="text-red-500 text-sm mt-1">{errors.student}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment *
              </label>
              <select
                name="assignment"
                value={formData.assignment}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assignment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an assignment</option>
                {assignments.map(assignment => (
                  <option key={assignment._id} value={assignment._id}>
                    {assignment.title} ({assignment.points} points)
                  </option>
                ))}
              </select>
              {errors.assignment && (
                <p className="text-red-500 text-sm mt-1">{errors.assignment}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade (out of {maxPoints})
              </label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                min="0"
                max={maxPoints}
                step="0.1"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.grade ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter grade"
              />
              {errors.grade && (
                <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
              )}
              {formData.grade && maxPoints > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Percentage: {((formData.grade / maxPoints) * 100).toFixed(1)}%
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graded Date
              </label>
              <input
                type="date"
                name="gradedAt"
                value={formData.gradedAt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter feedback for the student"
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
              {isSubmitting ? 'Saving...' : (grade ? 'Update' : 'Add')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GradeForm;
