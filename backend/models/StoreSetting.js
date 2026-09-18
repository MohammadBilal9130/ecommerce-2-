import mongoose from 'mongoose';

const storeSettingSchema = new mongoose.Schema({
  announcementText: {
    type: String,
    default: '🔥 FREE DELIVERY IN KAMPTEE & NAGPUR ON ORDERS ABOVE ₹999 | WHATSAPP ORDERS: +91 7020728378 / +91 8605337906'
  },
  announcementActive: {
    type: Boolean,
    default: true
  },
  freeShippingThreshold: {
    type: Number,
    default: 999
  },
  standardShippingFee: {
    type: Number,
    default: 49
  },
  codEnabled: {
    type: Boolean,
    default: true
  },
  onlinePaymentDiscountPercent: {
    type: Number,
    default: 5
  },
  primaryContactShoeb: {
    name: { type: String, default: 'Shoeb Khan' },
    phone: { type: String, default: '+917020728378' },
    whatsapp: { type: String, default: '917020728378' },
    role: { type: String, default: 'Co-Founder & Head of Operations' }
  },
  primaryContactShan: {
    name: { type: String, default: 'Shan Khan' },
    phone: { type: String, default: '+918605337906' },
    whatsapp: { type: String, default: '918605337906' },
    role: { type: String, default: 'Co-Founder & Creative Director' }
  },
  storeLocation: {
    address: { type: String, default: 'Main Market, Kamptee' },
    city: { type: String, default: 'Kamptee (Nagpur District)' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, default: '441001' }
  },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/gangster_menswear' },
    whatsappCommunity: { type: String, default: 'https://chat.whatsapp.com/' }
  }
}, {
  timestamps: true
});

const StoreSetting = mongoose.model('StoreSetting', storeSettingSchema);
export default StoreSetting;
