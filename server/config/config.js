require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'gkin_jwt_secret_key_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  
  // Default passcodes for each role
  passcodes: {
    liturgy: process.env.LITURGY_PASSCODE || 'liturgy123',
    pastor: process.env.PASTOR_PASSCODE || 'pastor123',
    translation: process.env.TRANSLATION_PASSCODE || 'translation123',
    beamer: process.env.BEAMER_PASSCODE || 'beamer123',
    music: process.env.MUSIC_PASSCODE || 'music123',
    treasurer: process.env.TREASURER_PASSCODE || 'treasurer123',
  }
};
