import StoreSetting from '../models/StoreSetting.js';
import AdminActivity from '../models/AdminActivity.js';

// @desc    Get store settings & announcement bar
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();
    if (!settings) {
      settings = await StoreSetting.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update store settings & announcement bar (Admin)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();
    if (!settings) {
      settings = new StoreSetting();
    }

    const {
      announcementText,
      announcementActive,
      freeShippingThreshold,
      standardShippingFee,
      codEnabled,
      primaryContactShoeb,
      primaryContactShan,
      storeLocation,
      socialLinks
    } = req.body;

    if (announcementText !== undefined) settings.announcementText = announcementText;
    if (announcementActive !== undefined) settings.announcementActive = Boolean(announcementActive);
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);
    if (standardShippingFee !== undefined) settings.standardShippingFee = Number(standardShippingFee);
    if (codEnabled !== undefined) settings.codEnabled = Boolean(codEnabled);
    if (primaryContactShoeb) settings.primaryContactShoeb = { ...settings.primaryContactShoeb, ...primaryContactShoeb };
    if (primaryContactShan) settings.primaryContactShan = { ...settings.primaryContactShan, ...primaryContactShan };
    if (storeLocation) settings.storeLocation = { ...settings.storeLocation, ...storeLocation };
    if (socialLinks) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };

    const updatedSettings = await settings.save();
    const adminName = req.user.adminAlias || req.user.name || 'Admin';

    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'UPDATE_SETTINGS',
      entityType: 'SETTINGS',
      details: `${adminName} updated store settings / announcement bar text`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: 'Store settings updated successfully!',
      settings: updatedSettings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
