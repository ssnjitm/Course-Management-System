const API_BASE_URL = 'http://localhost:5000/api';

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
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
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
  
  // Course endpoints
  getCourses(page = 1, limit = 10) {
    return this.request(`/courses?page=${page}&limit=${limit}`);
  },
  
  getCourse(id) {
    return this.request(`/courses/${id}`);
  },
  
  createCourse(data) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateCourse(id, data) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteCourse(id) {
    return this.request(`/courses/${id}`, {
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
};