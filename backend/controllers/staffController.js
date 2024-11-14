
const Application = require('../models/Application');
const Service = require('../models/Service');

// Fetch all applications
exports.getApplications = async (req, res) => {
    try {
        // Fetch all applications and populate the user and service details
        const applications = await Application.find()
            .populate('user', 'name email') // Populate user details (e.g., name and email)
            .populate('service', 'title description'); // Populate service details (e.g., title and description)

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update application status (approve/reject)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the application by ID
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        // Update the status of the application
        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};