import { useState, useCallback } from 'react';
import { api } from '../utils/api';

// Main API hook
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    callApi,
    reset,
  };
};

// Specific API hooks for different resources

// Courses API hook
export const useCoursesApi = () => {
  const { loading, error, data, callApi, reset } = useApi();

  const getCourses = useCallback(async () => {
    return callApi(api.getCourses);
  }, [callApi]);

  const getCourse = useCallback(async (id) => {
    return callApi(api.getCourse, id);
  }, [callApi]);

  const createCourse = useCallback(async (courseData) => {
    return callApi(api.createCourse, courseData);
  }, [callApi]);

  const updateCourse = useCallback(async (id, courseData) => {
    return callApi(api.updateCourse, id, courseData);
  }, [callApi]);

  const deleteCourse = useCallback(async (id) => {
    return callApi(api.deleteCourse, id);
  }, [callApi]);

  return {
    loading,
    error,
    courses: data,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    reset,
  };
};

// Students API hook
export const useStudentsApi = () => {
  const { loading, error, data, callApi, reset } = useApi();

  const getStudents = useCallback(async () => {
    return callApi(api.getStudents);
  }, [callApi]);

  const getStudent = useCallback(async (id) => {
    return callApi(api.getStudent, id);
  }, [callApi]);

  const createStudent = useCallback(async (studentData) => {
    return callApi(api.createStudent, studentData);
  }, [callApi]);

  const updateStudent = useCallback(async (id, studentData) => {
    return callApi(api.updateStudent, id, studentData);
  }, [callApi]);

  const deleteStudent = useCallback(async (id) => {
    return callApi(api.deleteStudent, id);
  }, [callApi]);

  return {
    loading,
    error,
    students: data,
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    reset,
  };
};

// Teachers API hook
export const useTeachersApi = () => {
  const { loading, error, data, callApi, reset } = useApi();

  const getTeachers = useCallback(async () => {
    return callApi(api.getTeachers);
  }, [callApi]);

  const getTeacher = useCallback(async (id) => {
    return callApi(api.getTeacher, id);
  }, [callApi]);

  const createTeacher = useCallback(async (teacherData) => {
    return callApi(api.createTeacher, teacherData);
  }, [callApi]);

  const updateTeacher = useCallback(async (id, teacherData) => {
    return callApi(api.updateTeacher, id, teacherData);
  }, [callApi]);

  const deleteTeacher = useCallback(async (id) => {
    return callApi(api.deleteTeacher, id);
  }, [callApi]);

  return {
    loading,
    error,
    teachers: data,
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    reset,
  };
};

// Auth API hook
export const useAuthApi = () => {
  const { loading, error, data, callApi, reset } = useApi();

  const login = useCallback(async (credentials) => {
    return callApi(api.login, credentials);
  }, [callApi]);

  const register = useCallback(async (userData) => {
    return callApi(api.register, userData);
  }, [callApi]);

  const getProfile = useCallback(async () => {
    return callApi(api.getProfile);
  }, [callApi]);

  const updateProfile = useCallback(async (profileData) => {
    return callApi(api.updateProfile, profileData);
  }, [callApi]);

  const changePassword = useCallback(async (passwordData) => {
    return callApi(api.changePassword, passwordData);
  }, [callApi]);

  return {
    loading,
    error,
    authData: data,
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
    reset,
  };
};

// Hook for API calls with automatic retry
export const useApiWithRetry = (maxRetries = 3) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const callApiWithRetry = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const result = await apiCall(...args);
        setData(result);
        setRetryCount(0);
        return result;
      } catch (err) {
        if (retries === maxRetries) {
          const errorMessage = err.message || 'An error occurred';
          setError(errorMessage);
          setRetryCount(retries);
          throw err;
        }
        
        retries++;
        setRetryCount(retries);
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }
  }, [maxRetries]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
    setRetryCount(0);
  }, []);

  return {
    loading,
    error,
    data,
    retryCount,
    callApi: callApiWithRetry,
    reset,
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiCall, initialPage = 1, pageSize = 10) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(async (pageNum = page, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(pageNum, pageSize);
      
      if (result && result.items) {
        if (append) {
          setData(prev => [...prev, ...result.items]);
        } else {
          setData(result.items);
        }
        
        setTotalPages(result.totalPages || Math.ceil(result.totalCount / pageSize));
        setTotalItems(result.totalCount || 0);
        setHasMore(pageNum < (result.totalPages || Math.ceil(result.totalCount / pageSize)));
      } else {
        // Handle non-paginated responses
        setData(result);
        setHasMore(false);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, page, pageSize]);

  const nextPage = useCallback(() => {
    if (hasMore && !loading) {
      const nextPageNum = page + 1;
      setPage(nextPageNum);
      return loadPage(nextPageNum, true);
    }
  }, [page, hasMore, loading, loadPage]);

  const prevPage = useCallback(() => {
    if (page > 1 && !loading) {
      const prevPageNum = page - 1;
      setPage(prevPageNum);
      return loadPage(prevPageNum, false);
    }
  }, [page, loading, loadPage]);

  const goToPage = useCallback((pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && !loading) {
      setPage(pageNum);
      return loadPage(pageNum, false);
    }
  }, [totalPages, loading, loadPage]);

  const refresh = useCallback(() => {
    return loadPage(page, false);
  }, [page, loadPage]);

  return {
    loading,
    error,
    data,
    page,
    totalPages,
    totalItems,
    hasMore,
    loadPage,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
};

// Hook for API cache
export const useApiCache = () => {
  const cache = useRef(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCachedData = useCallback((key) => {
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key, data) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const clearCache = useCallback((key = null) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  const callApiWithCache = useCallback(async (key, apiCall, ...args) => {
    // Check cache first
    const cachedData = getCachedData(key);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, make API call
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      setCachedData(key, result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  return {
    loading,
    error,
    getCachedData,
    setCachedData,
    clearCache,
    callApi: callApiWithCache,
  };
};