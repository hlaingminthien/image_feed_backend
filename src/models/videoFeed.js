const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VideoFeed = sequelize.define('VideoFeed', {
  videoName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gpsLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  gpsLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = {
  VideoFeed
};
