const validateAlphaNumeric = (value: string) => {
  const regex = /^[a-zA-Z0-9\s,.]*$/;
  return regex.test(value);
};

const validateNotEmpty = (value: string) => {
  return value.trim() !== "";
};

const validateText = (value: string) => {
  return validateNotEmpty(value) && validateAlphaNumeric(value);
};

export { validateText, validateNotEmpty, validateAlphaNumeric };
