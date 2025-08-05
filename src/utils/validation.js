const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailID, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  } else if (!emailID || !validator.isEmail(emailID)) {
    throw new Error("Valid email is required.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong.");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditableField = [
    "skills",
    "about",
    "age",
    "gender",
    "firstName",
    "lastName",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedEditableField.includes(field)
  );
  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
