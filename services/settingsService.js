const Settings = require('../models/Settings');

const getSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        // Create default settings if none exist
        settings = await Settings.create({});
    }
    return settings;
};

const updateSettings = async (settingsData) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create(settingsData);
    } else {
        settings = await Settings.findByIdAndUpdate(
            settings._id,
            settingsData,
            { new: true }
        );
    }
    return settings;
};

module.exports = {
    getSettings,
    updateSettings,
};
