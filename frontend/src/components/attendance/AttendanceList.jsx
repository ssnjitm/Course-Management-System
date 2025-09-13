import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const AttendanceList = ({ attendance, selectedDate, onUpdate }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.course?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || record.date === selectedDate;
    
    if (filter === 'all') return matchesSearch && matchesDate;
    if (filter === 'present') return matchesSearch && matchesDate && record.status === 'present';
    if (filter === 'absent') return matchesSearch && matchesDate && record.status === 'absent';
    if (filter === 'late') return matchesSearch && matchesDate && record.status === 'late';
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'fas fa-check-circle';
      case 'absent': return 'fas fa-times-circle';
      case 'late': return 'fas fa-clock';
      default: return 'fas fa-question-circle';
    }
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await onUpdate(recordId, { status: newStatus });
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search attendance records..."
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
            <option value="all">All Records</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="space-y-4">
        {filteredAttendance.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <i className="fas fa-calendar-check text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No attendance has been recorded yet'}
              </p>
            </CardBody>
          </Card>
        ) : (
          filteredAttendance.map((record) => (
            <Card key={record._id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {record.student?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.student?.name || 'Unknown Student'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {record.course?.name || 'Unknown Course'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(record.status)}`}>
                        <i className={`${getStatusIcon(record.status)} mr-2`}></i>
                        {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleStatusChange(record._id, 'present')}
                        className={`text-xs px-3 py-1 ${
                          record.status === 'present' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Present
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(record._id, 'absent')}
                        className={`text-xs px-3 py-1 ${
                          record.status === 'absent' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Absent
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(record._id, 'late')}
                        className={`text-xs px-3 py-1 ${
                          record.status === 'late' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        Late
                      </Button>
                    </div>
                  </div>
                </div>
                
                {record.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {record.notes}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
