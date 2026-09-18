import mongoose from 'mongoose';

const adminActivitySchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
    enum: ['Shoeb Khan', 'Shan Khan', 'Admin Staff', 'Super Admin']
  },
  adminEmail: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['PRODUCT', 'ORDER', 'SETTINGS', 'AUTH', 'SYSTEM'],
    required: true
  },
  entityId: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);
export default AdminActivity;
