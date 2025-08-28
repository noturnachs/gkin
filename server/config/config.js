require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'gkin_jwt_secret_key_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d'
};
