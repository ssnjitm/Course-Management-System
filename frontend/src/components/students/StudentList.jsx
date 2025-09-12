import { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import StudentCard from './StudentCard.jsx';
import StudentForm from './StudentForm.jsx';
import Button from '../ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import Table from '../ui/Table.jsx';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await api.deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const handleFormSubmit = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await api.updateStudent(editingStudent._id, studentData);
        setStudents(students.map(student => 
          student._id === editingStudent._id ? updatedStudent : student
        ));
      } else {
        const newStudent = await api.createStudent(studentData);
        setStudents([...students, newStudent]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Table columns configuration
  const tableColumns = [
    { 
      field: 'name', 
      header: 'Name',
      sortable: true
    },
    { 
      field: 'email', 
      header: 'Email',
      sortable: true
    },
    { 
      field: 'studentId', 
      header: 'Student ID',
      sortable: true
    },
    { 
      field: 'program', 
      header: 'Program',
      sortable: true
    },
    { 
      field: 'semester', 
      header: 'Semester',
      sortable: true
    },
    {
      field: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

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
            <h2 className="text-xl font-semibold">Student Management</h2>
            <p className="text-sm text-gray-600">
              {students.length} student{students.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-th-large mr-1"></i> Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'table' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-table mr-1"></i> Table
              </button>
            </div>
            <Button onClick={handleCreate}>
              <i className="fas fa-user-plus mr-2"></i> Add Student
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={students}
          keyField="_id"
          sortable
        />
      )}

      {students.length === 0 && !showForm && (
        <Card>
          <CardBody className="text-center py-12">
            <i className="fas fa-user-graduate text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No students found. Add your first student!</p>
            <Button className="mt-4" onClick={handleCreate}>
              Add Student
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default StudentList;