import { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import TeacherCard from './TeacherCard.jsx';
import TeacherForm from './TeacherForm.jsx';
import Button from '../ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import Table from '../ui/Table.jsx';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, statusFilter, departmentFilter]);

  const loadTeachers = async () => {
    try {
      const data = await api.getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.department === departmentFilter);
    }

    setFilteredTeachers(filtered);
  };

  const handleCreate = () => {
    setEditingTeacher(null);
    setShowForm(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      await api.deleteTeacher(id);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher. Please try again.');
    }
  };

  const handleFormSubmit = async (teacherData) => {
    try {
      if (editingTeacher) {
        const updatedTeacher = await api.updateTeacher(editingTeacher._id, teacherData);
        setTeachers(teachers.map(teacher => 
          teacher._id === editingTeacher._id ? updatedTeacher : teacher
        ));
      } else {
        const newTeacher = await api.createTeacher(teacherData);
        setTeachers([...teachers, newTeacher]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTeacher(null);
  };

  // Get unique departments for filter
  const departmentOptions = [...new Set(teachers.map(teacher => teacher.department).filter(Boolean))];

  // Table columns configuration
  const tableColumns = [
    { 
      field: 'name', 
      header: 'Name',
      sortable: true,
      cell: (item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            {item.name?.charAt(0) || 'T'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
          </div>
        </div>
      )
    },
    { 
      field: 'teacherId', 
      header: 'Teacher ID',
      sortable: true
    },
    { 
      field: 'department', 
      header: 'Department',
      sortable: true
    },
    { 
      field: 'designation', 
      header: 'Designation',
      sortable: true
    },
    { 
      field: 'status', 
      header: 'Status',
      sortable: true,
      cell: (item) => {
        const statusColors = {
          active: 'green',
          inactive: 'gray',
          on_leave: 'yellow'
        };
        const color = statusColors[item.status] || 'gray';
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-800`}>
            {item.status?.replace('_', ' ').charAt(0).toUpperCase() + item.status?.replace('_', ' ').slice(1)}
          </span>
        );
      }
    },
    {
      field: 'courses',
      header: 'Courses',
      cell: (item) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {item.courses?.length || 0} courses
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            <i className="fas fa-edit mr-1"></i> Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
            <i className="fas fa-trash mr-1"></i> Delete
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
            <h2 className="text-xl font-semibold">Teacher Management</h2>
            <p className="text-sm text-gray-600">
              {filteredTeachers.length} of {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} shown
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
              <i className="fas fa-chalkboard-teacher mr-2"></i> Add Teacher
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Teachers
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                id="department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Departments</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {showForm && (
        <TeacherForm
          teacher={editingTeacher}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <TeacherCard
              key={teacher._id}
              teacher={teacher}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={filteredTeachers}
          keyField="_id"
          sortable
        />
      )}

      {filteredTeachers.length === 0 && !showForm && (
        <Card>
          <CardBody className="text-center py-12">
            <i className="fas fa-chalkboard-teacher text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">
              {teachers.length === 0 
                ? 'No teachers found. Add your first teacher!' 
                : 'No teachers match your search criteria.'}
            </p>
            <Button className="mt-4" onClick={handleCreate}>
              Add Teacher
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default TeacherList;