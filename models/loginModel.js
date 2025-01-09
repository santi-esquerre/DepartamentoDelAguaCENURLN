const db = require("../config/db");
const LoginModel = {
  auth: (user, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [user], callback);
  },
};
module.exports = LoginModel;
