var crypto = require('crypto');
var passwordHash = require('password-hash');

module.exports.verify = function (combined, password) {
    return new Promise(function (fulfill, reject) {
        if (combined.indexOf(':') > -1) {
            //Old password style
            var ph = combined.split(':')
            var iterations = parseInt(ph[0]);
            var salt = Buffer.from(ph[1], 'base64');
            var hash = Buffer.from(ph[2], 'base64');

            // verify the salt and hash against the password
            crypto.pbkdf2(password, salt, iterations, hash.length, function (err, verify) {
                if (err) reject(err);
                else {
                    var isValid = verify.toString('binary') === hash.toString('binary')
                    console.log("pwd" + isValid)
                    fulfill(isValid)
                }
            });
        }
        else {
            fulfill(passwordHash.verify(password, combined))
        }
    });
}