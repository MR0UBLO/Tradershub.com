import Joi from "joi";

export const validateEmail = (email: string): boolean => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  return !error;
};

export const validatePassword = (password: string): boolean => {
  const schema = Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required();
  const { error } = schema.validate(password);
  return !error;
};

export const validateUsername = (username: string): boolean => {
  const schema = Joi.string().alphanum().min(3).max(30).required();
  const { error } = schema.validate(username);
  return !error;
};

export const validatePhone = (phone: string): boolean => {
  const schema = Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required();
  const { error } = schema.validate(phone);
  return !error;
};
