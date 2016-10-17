/**
 * @export
 * @param {String} email - email address
 * @return {Boolean} valid
 */
export default function testValidEmail(email) {
  return /.+@.+\..+/i.test(email);
}
