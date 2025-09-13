import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
    assignments: 0,
    grades: 0,
    attendance: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [coursesRes, studentsRes, teachersRes, assignmentsRes, gradesRes, attendanceRes] = await Promise.all([
        api.getCourses(),
        api.getStudents(),
        api.getTeachers(),
        api.getAssignments(),
        api.getGrades(),
        api.getAttendance()
      ]);
      
      setStats({
        courses: coursesRes.data?.length || coursesRes?.length || 0,
        students: studentsRes.data?.length || studentsRes?.length || 0,
        teachers: teachersRes.data?.length || teachersRes?.length || 0,
        assignments: assignmentsRes.data?.length || assignmentsRes?.length || 0,
        grades: gradesRes.data?.length || gradesRes?.length || 0,
        attendance: attendanceRes.data?.length || attendanceRes?.length || 0
      });

      // Generate mock recent activity based on user role
      generateRecentActivity();
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = () => {
    const activities = [];
    const now = new Date();
    
    if (user?.role === 'student') {
      activities.push(
        { id: 1, type: 'assignment', message: 'New assignment posted: Math Homework', time: '2 hours ago', icon: 'fas fa-tasks' },
        { id: 2, type: 'grade', message: 'Grade received for Science Quiz: A', time: '1 day ago', icon: 'fas fa-chart-bar' },
        { id: 3, type: 'course', message: 'Enrolled in Advanced Physics', time: '3 days ago', icon: 'fas fa-book' }
      );
    } else if (user?.role === 'teacher') {
      activities.push(
        { id: 1, type: 'assignment', message: 'Assignment submitted by John Doe', time: '1 hour ago', icon: 'fas fa-tasks' },
        { id: 2, type: 'grade', message: 'Graded 15 assignments', time: '3 hours ago', icon: 'fas fa-chart-bar' },
        { id: 3, type: 'attendance', message: 'Marked attendance for Math Class', time: '1 day ago', icon: 'fas fa-calendar-check' }
      );
    } else if (user?.role === 'admin') {
      activities.push(
        { id: 1, type: 'student', message: 'New student registered: Jane Smith', time: '30 minutes ago', icon: 'fas fa-user-graduate' },
        { id: 2, type: 'teacher', message: 'Teacher profile updated', time: '2 hours ago', icon: 'fas fa-chalkboard-teacher' },
        { id: 3, type: 'course', message: 'New course created: Advanced Mathematics', time: '1 day ago', icon: 'fas fa-book' }
      );
    }
    
    setRecentActivity(activities);
  };

  const getRoleSpecificStats = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'My Courses',
          value: stats.courses,
          icon: 'fas fa-book',
          color: 'blue',
          description: 'Courses you are enrolled in'
        },
        {
          title: 'Assignments',
          value: stats.assignments,
          icon: 'fas fa-tasks',
          color: 'green',
          description: 'Total assignments'
        },
        {
          title: 'Grades',
          value: stats.grades,
          icon: 'fas fa-chart-bar',
          color: 'purple',
          description: 'Grades received'
        }
      ];
    } else if (user?.role === 'teacher') {
      return [
        {
          title: 'My Courses',
          value: stats.courses,
          icon: 'fas fa-book',
          color: 'blue',
          description: 'Courses you teach'
        },
        {
          title: 'Students',
          value: stats.students,
          icon: 'fas fa-user-graduate',
          color: 'green',
          description: 'Students in your classes'
        },
        {
          title: 'Assignments',
          value: stats.assignments,
          icon: 'fas fa-tasks',
          color: 'purple',
          description: 'Assignments created'
        }
      ];
    } else {
      return [
        {
          title: 'Total Courses',
          value: stats.courses,
          icon: 'fas fa-book',
          color: 'blue',
          description: 'All courses in the system'
        },
        {
          title: 'Total Students',
          value: stats.students,
          icon: 'fas fa-user-graduate',
          color: 'green',
          description: 'All registered students'
        },
        {
          title: 'Total Teachers',
          value: stats.teachers,
          icon: 'fas fa-chalkboard-teacher',
          color: 'purple',
          description: 'All registered teachers'
        }
      ];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const roleStats = getRoleSpecificStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back, {user?.name}! Here's what's happening in your {user?.role === 'student' ? 'learning' : user?.role === 'teacher' ? 'teaching' : 'management'} dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roleStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardBody className="flex items-center">
              <div className={`bg-${stat.color}-100 p-3 rounded-full mr-4`}>
                <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <i className={`${activity.icon} text-blue-600 text-sm`}></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {user?.role === 'student' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-tasks text-blue-600 mr-3"></i>
                    View Assignments
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-chart-bar text-green-600 mr-3"></i>
                    Check Grades
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-book text-purple-600 mr-3"></i>
                    Browse Courses
                  </button>
                </>
              )}
              {user?.role === 'teacher' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-plus text-blue-600 mr-3"></i>
                    Create Assignment
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-calendar-check text-green-600 mr-3"></i>
                    Mark Attendance
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-chart-bar text-purple-600 mr-3"></i>
                    Grade Assignments
                  </button>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-user-plus text-blue-600 mr-3"></i>
                    Add Student
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-chalkboard-teacher text-green-600 mr-3"></i>
                    Add Teacher
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <i className="fas fa-file-alt text-purple-600 mr-3"></i>
                    Generate Reports
                  </button>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;