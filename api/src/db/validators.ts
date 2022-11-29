type validatorFn = (arg: string) => boolean;

const validateEmail = (email: string): boolean => {
  const re =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return re.test(email);
};

type validator = {
  validator: validatorFn;
  message: string;
};

export const emailValidator = {
  validator: validateEmail,
  message: "Email format is not valid",
};
