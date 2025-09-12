import CourseList from '../components/courses/CourseList.jsx';

const Courses = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Course Management</h1>
      <CourseList />
    </div>
  );
};

export default Courses;