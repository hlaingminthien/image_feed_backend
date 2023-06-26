// videoController.js

const videoService = require('../services/videoService');

exports.uploadVideo = async (req, res) => {
  try {
    const { videoName } = req.body;
    const { path } = req.file;

    // Extract GPS coordinates from the video metadata
    const gpsCoordinates = await videoService.extractGPSCoordinates(path);

    // Call the service method to handle video upload
    await videoService.uploadVideo(videoName, gpsCoordinates);

    res.status(200).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

exports.getVideoFeeds = async (req, res) => {
  try {
    // Call the service method to retrieve all video feeds
    const videoFeeds = await videoService.getVideoFeeds();

    res.status(200).json(videoFeeds);
  } catch (error) {
    console.error('Error retrieving video feeds:', error);
    res.status(500).json({ error: 'Failed to retrieve video feeds' });
  }
};
