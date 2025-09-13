import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx';
import AttendanceList from '../components/attendance/AttendanceList.jsx';
import AttendanceForm from '../components/attendance/AttendanceForm.jsx';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attendanceRes, studentsRes, coursesRes] = await Promise.all([
        api.getAttendance(),
        api.getStudents(),
        api.getCourses()
      ]);
      
      setAttendance(attendanceRes.data || attendanceRes || []);
      setStudents(studentsRes.data || studentsRes || []);
      setCourses(coursesRes.data || coursesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (attendanceData) => {
    try {
      await api.markAttendance(attendanceData);
      loadData(); // Reload to get updated attendance
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const handleUpdateAttendance = async (id, attendanceData) => {
    try {
      await api.updateAttendance(id, attendanceData);
      loadData(); // Reload to get updated attendance
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading attendance...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Mark Attendance
          </button>
        </div>
      </div>

      <AttendanceList
        attendance={attendance}
        selectedDate={selectedDate}
        onUpdate={handleUpdateAttendance}
      />

      {showForm && (
        <AttendanceForm
          students={students}
          courses={courses}
          selectedDate={selectedDate}
          onSubmit={handleMarkAttendance}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Attendance;
