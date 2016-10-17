/**
 * @export
 * @param {String} email - email address
 * @return {Boolean} valid
 */
module.exports = function testValidEmail(email) {
  return /.+@.+\..+/i.test(email);
}
