import { Card, CardBody, CardFooter } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {teacher.name?.charAt(0) || 'T'}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-gray-600">{teacher.email}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(teacher.status)}`}>
            {teacher.status?.replace('_', ' ').charAt(0).toUpperCase() + teacher.status?.replace('_', ' ').slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500 block text-xs">Teacher ID:</span>
            <p className="font-medium truncate">{teacher.teacherId || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Phone:</span>
            <p className="font-medium truncate">{teacher.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500 block text-xs">Department:</span>
            <p className="font-medium truncate">{teacher.department || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Designation:</span>
            <p className="font-medium truncate">{teacher.designation || 'N/A'}</p>
          </div>
        </div>

        {teacher.qualification && (
          <div className="text-sm mb-3">
            <span className="text-gray-500 block text-xs">Qualification:</span>
            <p className="font-medium truncate" title={teacher.qualification}>
              {teacher.qualification}
            </p>
          </div>
        )}

        {teacher.specialization && (
          <div className="text-sm">
            <span className="text-gray-500 block text-xs">Specialization:</span>
            <p className="font-medium truncate" title={teacher.specialization}>
              {teacher.specialization}
            </p>
          </div>
        )}

        {teacher.office && (
          <div className="text-sm mt-3">
            <span className="text-gray-500 block text-xs">Office:</span>
            <p className="font-medium truncate" title={teacher.office}>
              {teacher.office}
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500 block text-xs">Assigned Courses:</span>
          <p className="font-medium">
            {teacher.courses?.length || 0} course{teacher.courses?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(teacher)}>
          <i className="fas fa-edit mr-1"></i> Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(teacher._id)}>
          <i className="fas fa-trash mr-1"></i> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherCard;