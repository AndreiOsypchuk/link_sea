enum BodyFields {
  HANDLE = "handle",
  EMAIL = "email",
  PASSWORD = "password",
  TOKEN = "token",
}
export const BodyType = {
  REGISTER: [BodyFields.HANDLE, BodyFields.EMAIL, BodyFields.PASSWORD],
  LOGIN: [BodyFields.EMAIL, BodyFields.PASSWORD],
  RESET_PASS: [BodyFields.PASSWORD, BodyFields.TOKEN],
  REQUSET_EMAIL: [BodyFields.EMAIL],
};
