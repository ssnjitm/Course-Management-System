import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [courses, students, teachers] = await Promise.all([
        api.getCourses(),
        api.getStudents(),
        api.getTeachers()
      ]);
      
      setStats({
        courses: courses.length,
        students: students.length,
        teachers: teachers.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-book text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Courses</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-user-graduate text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-chalkboard-teacher text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Teachers</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500">No recent activity</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;