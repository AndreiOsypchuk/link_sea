import { RequestField } from "./request.fields";
export default {
  Register: [
    RequestField.FIRST_NAME,
    RequestField.LAST_NAME,
    RequestField.EMAIL,
    RequestField.PASSWORD,
  ],
  Login: [RequestField.EMAIL, RequestField.PASSWORD],
};
