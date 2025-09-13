import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    assignments: 0,
    attendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [studentsRes, teachersRes, coursesRes, assignmentsRes] = await Promise.all([
        api.getStudents(),
        api.getTeachers(),
        api.getCourses(),
        api.getAssignments()
      ]);
      
      setReports({
        students: studentsRes.data?.length || studentsRes?.length || 0,
        teachers: teachersRes.data?.length || teachersRes?.length || 0,
        courses: coursesRes.data?.length || coursesRes?.length || 0,
        assignments: assignmentsRes.data?.length || assignmentsRes?.length || 0,
        attendance: 0 // This would need a specific endpoint
      });
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      // This would call a specific report generation endpoint
      console.log(`Generating ${reportType} report...`);
      alert(`${reportType} report generation not implemented yet.`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">
          Generate comprehensive reports and view system analytics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-user-graduate text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
              <p className="text-2xl font-bold text-gray-900">{reports.students}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-chalkboard-teacher text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Teachers</h3>
              <p className="text-2xl font-bold text-gray-900">{reports.teachers}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-book text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Courses</h3>
              <p className="text-2xl font-bold text-gray-900">{reports.courses}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <i className="fas fa-tasks text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Assignments</h3>
              <p className="text-2xl font-bold text-gray-900">{reports.assignments}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Student Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate comprehensive student reports</p>
            <button
              onClick={() => generateReport('Student')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Student Report
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Course Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate course performance reports</p>
            <button
              onClick={() => generateReport('Course')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Course Report
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Attendance Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate attendance summary reports</p>
            <button
              onClick={() => generateReport('Attendance')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Attendance Report
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Grade Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate grade distribution reports</p>
            <button
              onClick={() => generateReport('Grade')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Grade Report
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Teacher Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate teacher performance reports</p>
            <button
              onClick={() => generateReport('Teacher')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Teacher Report
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">System Reports</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Generate overall system reports</p>
            <button
              onClick={() => generateReport('System')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Generate System Report
            </button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
