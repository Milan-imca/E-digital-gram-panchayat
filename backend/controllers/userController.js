const User = require('../models/User');
const Service = require('../models/Service');
const Application = require('../models/Application');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Validate role
//         if (role !== 'user') return res.status(400).json({ msg: 'Invalid role' });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({ name, email, password: hashedPassword, role });
//         await newUser.save();

//         res.json({ msg: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };
exports.register = async (req, res) => {
  try {
      const { name, email, password, role } = req.body;

      // Validate role
      const validRoles = ['user', 'admin', 'staff'];  // Define allowed roles
      if (!validRoles.includes(role)) {
          return res.status(400).json({ msg: 'Invalid role' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.json({ msg: 'User registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
  }
};
// User login
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: 'User not found' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

//         const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };
// User login
exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      // Generate JWT token
      const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return both token and user object
      res.json({ token, user: { id: user.id, role: user.role, name: user.name, email: user.email } });
  } catch (error) {
      res.status(500).json({ msg: 'Server Error' });
  }
};


// View available services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Apply for a service
exports.applyService = async (req, res) => {
    try {
        const { id } = req.params;
        const newApplication = new Application({ user: req.user.id, service: id });
        await newApplication.save();
        res.json(newApplication);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// View my applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).populate('service');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Get user profile including applied services
// exports.getUserProfile = async (req, res) => {
//   try {
//     // Fetch the user details (name and email)
//     const user = await User.findById(req.user.id).select('name email');
//     if (!user) {
//       return res.status(400).json({ msg: 'User not found' });
//     }

//     // Get the user's applied services
//     const applications = await Application.find({ user: req.user.id })
//       .populate('service', 'title description'); // Populate with service title and description

//     // Respond with user profile data including applied services and their statuses
//     res.json({
//       name: user.name,
//       email: user.email,
//       appliedServices: applications.map(application => ({
//         serviceTitle: application.service.title,  // Show service title (name)
//         serviceDescription: application.service.description,  // Service description
//         status: application.status,  // Status of the application (approved, rejected, etc.)
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ msg: 'Server Error' });
//   }
// };


// Get user profile including applied services
exports.getUserProfile = async (req, res) => {
  try {
    // Fetch the user details (name and email)
    const user = await User.findById(req.user.id).select('name email');
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Get the user's applied services (populate service details)
    const applications = await Application.find({ user: req.user.id })
      .populate('service', 'title description'); // Populate with service title and description

    // Respond with user profile data including applied services and their statuses
    res.json({
      name: user.name,
      email: user.email,
      appliedServices: applications.map(application => ({
        serviceTitle: application.service.title, // Show service title (name)
        serviceDescription: application.service.description, // Service description
        status: application.status, // Status of the application (pending, approved, etc.)
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};
