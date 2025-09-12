import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Courses from './pages/Courses.jsx';
import Students from './pages/Students.jsx';
import Teachers from './pages/Teachers.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Students />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/teachers" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Teachers />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Layout from './components/layout/Layout';
// import Dashboard from './pages/Dashboard';
// import Courses from './pages/Courses';
// import Students from './pages/Students';
// import Teachers from './pages/Teachers';
// import Login from './pages/Login';
// import Register from './pages/Register';

// function ProtectedRoute({ children, requiredRole }) {
//   const { user } = useAuth();
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
  
//   if (requiredRole && user.role !== requiredRole) {
//     return <Navigate to="/" />;
//   }
  
//   return children;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="*" element={
//             <ProtectedRoute>
//               <Layout>
//                 <Routes>
//                   <Route path="/" element={<Dashboard />} />
//                   <Route path="/courses" element={<Courses />} />
//                   <Route path="/students" element={<Students />} />
//                   <Route 
//                     path="/teachers" 
//                     element={
//                       <ProtectedRoute requiredRole="admin">
//                         <Teachers />
//                       </ProtectedRoute>
//                     } 
//                   />
//                 </Routes>
//               </Layout>
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;