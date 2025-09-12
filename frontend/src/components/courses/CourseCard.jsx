import { Card, CardBody, CardFooter } from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Credits: {course.credits}</span>
          <span className="mx-2">•</span>
          <span>Students: {course.students?.length || 0}</span>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(course._id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;