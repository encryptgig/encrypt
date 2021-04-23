export const validateEmail = (email) => {
  console.log(email);
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateNumber = (numString) => {
  const re = /^[1-9][0-9]*$/;
  return re.test(numString);
};

export const validateColRange = (numString) => {
  const re = /^[a-zA-Z,-]*$/;
  return re.test(numString);
};
