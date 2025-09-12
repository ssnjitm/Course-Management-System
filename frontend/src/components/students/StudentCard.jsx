import { Card, CardBody, CardFooter } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const StudentCard = ({ student, onEdit, onDelete }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {student.name?.charAt(0) || 'S'}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
            {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500 block text-xs">Student ID:</span>
            <p className="font-medium truncate">{student.studentId || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Phone:</span>
            <p className="font-medium truncate">{student.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500 block text-xs">Program:</span>
            <p className="font-medium truncate">{student.program || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Semester:</span>
            <p className="font-medium">{student.semester ? `Sem ${student.semester}` : 'N/A'}</p>
          </div>
        </div>

        {student.dateOfBirth && (
          <div className="text-sm mb-3">
            <span className="text-gray-500 block text-xs">Date of Birth:</span>
            <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
          </div>
        )}

        {student.address && (
          <div className="text-sm">
            <span className="text-gray-500 block text-xs">Address:</span>
            <p className="font-medium truncate" title={student.address}>
              {student.address}
            </p>
          </div>
        )}

        {student.emergencyContact && (
          <div className="text-sm mt-3">
            <span className="text-gray-500 block text-xs">Emergency Contact:</span>
            <p className="font-medium truncate" title={student.emergencyContact}>
              {student.emergencyContact}
            </p>
          </div>
        )}
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(student)}>
          <i className="fas fa-edit mr-1"></i> Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(student._id)}>
          <i className="fas fa-trash mr-1"></i> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;