// server/models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: String, // URL to uploaded image (Cloudinary, etc.)
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  category: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
  preferredTime: String, // e.g., '14:00'
  anonymous: {
    type: Boolean,
    default: false,
  },
  contact: String, // email or phone, optional if anonymous
  ward: String, // area/ward name
  landmark: String, // nearby landmark
  dateReported: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
