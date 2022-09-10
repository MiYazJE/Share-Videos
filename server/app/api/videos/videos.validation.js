const Yup = require('yup');

const searchParam = Yup.object({
  params: Yup.object({
    q: Yup.string().required('Room name is required'),
  }),
});

module.exports = {
  searchParam,
};
