const bcrypt = require("bcrypt");

exports.hash = (pass) => {
  return bcrypt.hash(pass, 10);
};

exports.compare = (pass, passDB) => {
  return bcrypt.compare(pass, passDB);
};
