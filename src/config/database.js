const { Sequelize } = require('sequelize');
const config = require('./config.json');

const environment = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[environment];

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect
  }
);

module.exports = sequelize;
