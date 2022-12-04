enum BodyFields {
  HANDLE = "handle",
  EMAIL = "email",
  PASSWORD = "password",
}
export const BodyType = {
  REGISTER: [BodyFields.HANDLE, BodyFields.EMAIL, BodyFields.PASSWORD],
  LOGIN: [BodyFields.EMAIL, BodyFields.PASSWORD],
};
