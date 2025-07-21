import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config (memory storage)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// POST /api/complaints - Submit a new complaint
export const submitComplaint = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      // Upload image to Cloudinary using a Promise
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'civic-complaints',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // Parse location (lat,lng) if provided as string
    let lat = null, lng = null;
    if (req.body.location) {
      const loc = req.body.location.split(',').map(Number);
      if (loc.length === 2) {
        lat = loc[0];
        lng = loc[1];
      }
    }

    const complaint = await Complaint.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: imageUrl || req.body.imageUrl || '',
      location: {
        lat,
        lng,
        address: req.body.landmark || '',
      },
      category: req.body.category,
      severity: req.body.severity,
      preferredTime: req.body.preferredTime,
      anonymous: req.body.anonymous === 'true' || req.body.anonymous === true,
      contact: req.body.anonymous === 'true' || req.body.anonymous === true ? 'Anonymous' : req.body.contact,
      ward: req.body.ward,
      landmark: req.body.landmark,
      dateReported: req.body.dateReported || new Date(),
      status: 'Pending',
      createdBy: req.user ? req.user._id : null,
    });
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ message: 'Failed to submit complaint', error: error.message });
  }
};

// GET /api/complaints - List complaints (role-based)
export const listComplaints = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'citizen') {
      filter = { createdBy: req.user._id };
    } else if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.ward) {
      filter.ward = req.query.ward;
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

// GET /api/complaints/:id - Get single complaint (role-based)
export const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    // Citizens can only access their own complaints
    if (req.user.role === 'citizen' && complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaint', error: error.message });
  }
};
