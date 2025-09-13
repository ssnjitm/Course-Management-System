import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const GradeList = ({ grades, user, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.assignment?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'graded') return matchesSearch && grade.grade !== null;
    if (filter === 'ungraded') return matchesSearch && grade.grade === null;
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade, maxPoints) => {
    if (grade === null) return 'text-gray-500';
    
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade, maxPoints) => {
    if (grade === null) return 'N/A';
    
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Grades</option>
            <option value="graded">Graded</option>
            <option value="ungraded">Ungraded</option>
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <i className="fas fa-chart-bar text-gray-400 text-4xl mb-4"></i>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
                      <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms' : 'No grades have been recorded yet'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => (
                    <tr key={grade._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {grade.student?.name?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {grade.student?.name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {grade.student?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {grade.assignment?.title || 'Unknown Assignment'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {grade.assignment?.points || 100} points
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {grade.assignment?.course?.name || 'Unknown Course'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-semibold ${getGradeColor(grade.grade, grade.assignment?.points || 100)}`}>
                            {grade.grade !== null ? grade.grade : 'N/A'}
                          </span>
                          {grade.grade !== null && (
                            <span className={`ml-2 text-sm ${getGradeColor(grade.grade, grade.assignment?.points || 100)}`}>
                              ({getGradeLetter(grade.grade, grade.assignment?.points || 100)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.submittedAt ? formatDate(grade.submittedAt) : 'Not submitted'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => onEdit(grade)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                          >
                            {grade.grade !== null ? 'Edit' : 'Grade'}
                          </Button>
                          <Button
                            onClick={() => onDelete(grade._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GradeList;
