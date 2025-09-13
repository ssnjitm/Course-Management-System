const API_BASE_URL = 'http://localhost:5000';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // For DELETE requests that might not return content
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  },

  // Auth endpoints
  async login(credentials) {
    const payload = {
      userEmail: credentials.email,
      password: credentials.password,
    };
    const raw = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Normalize backend response to { user, token }
    const data = raw.data || raw;
    const user = data.user || {};
    return {
      user: {
        id: user._id,
        name: user.userName || user.name,
        email: user.userEmail || user.email,
        role: user.role,
      },
      token: data.accessToken || data.token,
    };
  },
  
  async register(userData) {
    const payload = {
      userName: userData.name,
      userEmail: userData.email,
      password: userData.password,
      role: userData.role || 'student',
    };
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  
  getProfile() {
    return this.request('/auth/profile');
  },
  
  updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
  
  // Course endpoints (match backend routes)
  getCourses() {
    return this.request(`/student/course/get`);
  },
  
  getCourse(id) {
    return this.request(`/student/course/get/details/${id}`);
  },

  createCourse(data) {
    return this.request('/instructor/course/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCourse(id, data) {
    return this.request(`/instructor/course/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCourse(id) {
    return this.request(`/instructor/course/delete/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Student endpoints
  getStudents(page = 1, limit = 10) {
    return this.request(`/students?page=${page}&limit=${limit}`);
  },
  
  getStudent(id) {
    return this.request(`/students/${id}`);
  },
  
  createStudent(data) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateStudent(id, data) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Teacher endpoints
  getTeachers(page = 1, limit = 10) {
    return this.request(`/teachers?page=${page}&limit=${limit}`);
  },
  
  getTeacher(id) {
    return this.request(`/teachers/${id}`);
  },
  
  createTeacher(data) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateTeacher(id, data) {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteTeacher(id) {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Enrollment endpoints
  getEnrollments(courseId = null) {
    const url = courseId ? `/enrollments?courseId=${courseId}` : '/enrollments';
    return this.request(url);
  },
  
  enrollStudent(data) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateEnrollment(id, data) {
    return this.request(`/enrollments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteEnrollment(id) {
    return this.request(`/enrollments/${id}`, {
      method: 'DELETE',
    });
  },

  // Assignment endpoints (placeholder - will need backend implementation)
  getAssignments() {
    return Promise.resolve({ data: [] });
  },

  getAssignment(id) {
    return this.request(`/assignments/${id}`);
  },

  createAssignment(data) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAssignment(id, data) {
    return this.request(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAssignment(id) {
    return this.request(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  submitAssignment(id, data) {
    return this.request(`/assignments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Grade endpoints (placeholder - will need backend implementation)
  getGrades() {
    return Promise.resolve({ data: [] });
  },

  getGrade(id) {
    return this.request(`/grades/${id}`);
  },

  createGrade(data) {
    return this.request('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGrade(id, data) {
    return this.request(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteGrade(id) {
    return this.request(`/grades/${id}`, {
      method: 'DELETE',
    });
  },

  // Attendance endpoints (placeholder - will need backend implementation)
  getAttendance() {
    return Promise.resolve({ data: [] });
  },

  getAttendanceRecord(id) {
    return this.request(`/attendance/${id}`);
  },

  markAttendance(data) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAttendance(id, data) {
    return this.request(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAttendance(id) {
    return this.request(`/attendance/${id}`, {
      method: 'DELETE',
    });
  },
};