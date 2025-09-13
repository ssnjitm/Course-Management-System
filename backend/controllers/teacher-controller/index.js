import Teacher from '../../models/Teacher.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const teachers = await Teacher.find(query)
      .populate('teachingCourses', 'name code')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      data: teachers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers'
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('teachingCourses', 'name code description');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher'
    });
  }
};

// Create new teacher
export const createTeacher = async (req, res) => {
  try {
    const teacherData = req.body;
    
    // Check if teacher with email or employeeId already exists
    const existingTeacher = await Teacher.findOne({
      $or: [
        { email: teacherData.email },
        { employeeId: teacherData.employeeId }
      ]
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email or employee ID already exists'
      });
    }

    const teacher = new Teacher(teacherData);
    await teacher.save();

    res.status(201).json({
      success: true,
      data: teacher,
      message: 'Teacher created successfully'
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating teacher'
    });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if email or employeeId is being changed and if it conflicts
    if (updateData.email || updateData.employeeId) {
      const existingTeacher = await Teacher.findOne({
        _id: { $ne: id },
        $or: [
          { email: updateData.email },
          { employeeId: updateData.employeeId }
        ]
      });

      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Teacher with this email or employee ID already exists'
        });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('teachingCourses', 'name code');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating teacher'
    });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher'
    });
  }
};
