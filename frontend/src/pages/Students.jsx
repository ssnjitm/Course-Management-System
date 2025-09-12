import StudentList from '../components/students/StudentList.jsx';

const Students = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h1>
      <StudentList />
    </div>
  );
};

export default Students;