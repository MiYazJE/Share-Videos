const Yup = require('yup');

const register = Yup.object({
  body: Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  }),
});

const login = Yup.object({
  body: Yup.object({
    name: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
  }),
});

module.exports = {
  register,
  login,
};
