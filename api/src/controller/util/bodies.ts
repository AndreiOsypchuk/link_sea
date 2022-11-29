import { RequestField } from "./request.fields";
export default {
  Register: [RequestField.HANDLE, RequestField.EMAIL, RequestField.PASSWORD],
  Login: [RequestField.EMAIL, RequestField.PASSWORD],
  CreateLink: [RequestField.NAME, RequestField.HREF],
};
