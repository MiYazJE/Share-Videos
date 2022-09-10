const Yup = require('yup');

const create = Yup.object({
  body: Yup.object({
    name: Yup.string()
      .min(3)
      .required('Room name is required'),
  }),
});

module.exports = {
  create,
};
