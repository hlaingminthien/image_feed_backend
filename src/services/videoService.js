const { VideoFeed } = require('../models/videoFeed');
const gpsUtils = require('../utils/gpsUtils');

exports.uploadVideo = async (videoName, gpsCoordinates) => {
  const { latitude, longitude } = gpsCoordinates;

  // Create a new video feed record in the database
  await VideoFeed.create({
    videoName,
    gpsLatitude: latitude,
    gpsLongitude: longitude
  });
};

exports.getVideoFeeds = async () => {
  try {
    // Retrieve all video feed records from the database
    return await VideoFeed.findAll();
  } catch (error) {
    console.error('Error retrieving video feeds:', error);
    throw error;
  }
};

exports.extractGPSCoordinates = async (videoPath) => {
  try {
    // Extract GPS coordinates using the appropriate method or implementation
    const gpsCoordinates = await gpsUtils.extractGPSCoordinates(videoPath);
    return gpsCoordinates;
  } catch (error) {
    console.error('Error extracting GPS coordinates:', error);
    throw error;
  }
};
