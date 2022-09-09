function validateSchema(schema) {
  return async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      return res.status(400).json({
        message: err.message,
        path: err.path,
      });
    }
  };
}

module.exports = {
  validateSchema,
};
