import TeacherList from '../components/teachers/TeacherList.jsx';

const Teachers = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all teachers in the system
          </p>
        </div>
      </div>
      <TeacherList />
    </div>
  );
};

export default Teachers;