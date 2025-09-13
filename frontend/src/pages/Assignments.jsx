import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import AssignmentForm from '../components/assignments/AssignmentForm.jsx';
import AssignmentList from '../components/assignments/AssignmentList.jsx';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsRes, coursesRes] = await Promise.all([
        api.getAssignments(),
        api.getCourses()
      ]);
      
      setAssignments(assignmentsRes.data || assignmentsRes || []);
      setCourses(coursesRes.data || coursesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAssignment(null);
    setShowForm(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleFormSubmit = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await api.updateAssignment(editingAssignment._id, assignmentData);
        setAssignments(assignments.map(a => 
          a._id === editingAssignment._id ? { ...a, ...assignmentData } : a
        ));
      } else {
        const newAssignment = await api.createAssignment(assignmentData);
        setAssignments([...assignments, newAssignment.data || newAssignment]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Failed to save assignment. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await api.deleteAssignment(id);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment. Please try again.');
    }
  };

  const handleSubmitAssignment = async (assignmentId, submissionData) => {
    try {
      await api.submitAssignment(assignmentId, submissionData);
      loadData(); // Reload to get updated submissions
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading assignments...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'View and submit your assignments' 
              : 'Manage assignments for your courses'
            }
          </p>
        </div>
        {user?.role !== 'student' && (
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            Create Assignment
          </Button>
        )}
      </div>

      <AssignmentList
        assignments={assignments}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={handleSubmitAssignment}
      />

      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Assignments;
