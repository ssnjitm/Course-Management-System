import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx';
import GradeList from '../components/grades/GradeList.jsx';
import GradeForm from '../components/grades/GradeForm.jsx';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gradesRes, assignmentsRes] = await Promise.all([
        api.getGrades(),
        api.getAssignments()
      ]);
      
      setGrades(gradesRes.data || gradesRes || []);
      setAssignments(assignmentsRes.data || assignmentsRes || []);
      
      // Load students if user is teacher/admin
      if (user?.role !== 'student') {
        const studentsRes = await api.getStudents();
        setStudents(studentsRes.data || studentsRes || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleFormSubmit = async (gradeData) => {
    try {
      if (editingGrade) {
        await api.updateGrade(editingGrade._id, gradeData);
        setGrades(grades.map(g => 
          g._id === editingGrade._id ? { ...g, ...gradeData } : g
        ));
      } else {
        const newGrade = await api.createGrade(gradeData);
        setGrades([...grades, newGrade.data || newGrade]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    
    try {
      await api.deleteGrade(id);
      setGrades(grades.filter(g => g._id !== id));
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Failed to delete grade. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading grades...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'View your grades and performance' 
              : 'Manage student grades and performance'
            }
          </p>
        </div>
        {user?.role !== 'student' && (
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Grade
          </button>
        )}
      </div>

      <GradeList
        grades={grades}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <GradeForm
          grade={editingGrade}
          assignments={assignments}
          students={students}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Grades;
