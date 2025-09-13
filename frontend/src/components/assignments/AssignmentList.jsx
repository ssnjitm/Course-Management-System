import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const AssignmentList = ({ assignments, user, onEdit, onDelete, onSubmit }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'pending') return matchesSearch && !assignment.submitted;
    if (filter === 'submitted') return matchesSearch && assignment.submitted;
    if (filter === 'graded') return matchesSearch && assignment.graded;
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (assignment) => {
    if (assignment.graded) return 'bg-green-100 text-green-800';
    if (assignment.submitted) return 'bg-blue-100 text-blue-800';
    if (new Date(assignment.dueDate) < new Date()) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (assignment) => {
    if (assignment.graded) return 'Graded';
    if (assignment.submitted) return 'Submitted';
    if (new Date(assignment.dueDate) < new Date()) return 'Overdue';
    return 'Pending';
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search assignments..."
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
            <option value="all">All Assignments</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-tasks text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No assignments have been created yet'}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {assignment.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                    {getStatusText(assignment)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Course: {assignment.course?.name || 'Unknown Course'}
                </p>
              </CardHeader>
              
              <CardBody>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {assignment.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium">{formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Points:</span>
                    <span className="font-medium">{assignment.points || 100}</span>
                  </div>
                  {assignment.submitted && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Submitted:</span>
                      <span className="font-medium">{formatDate(assignment.submittedAt)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {user?.role === 'student' ? (
                    <>
                      {!assignment.submitted && (
                        <Button
                          onClick={() => onSubmit(assignment._id, {})}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                        >
                          Submit
                        </Button>
                      )}
                      <Button
                        onClick={() => {/* View assignment details */}}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1"
                      >
                        View
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => onEdit(assignment)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(assignment._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
