async function create(req, res) {
  const { roomsCtrl } = req.app.locals;
  const room = await roomsCtrl.create(req.user.name);
  res.json(room);
}

async function isValid(req, res) {
  const { id } = req.params;
  const { roomsCtrl } = req.app.locals;
  const roomExists = Boolean(await roomsCtrl.get(id));
  res.json(roomExists);
}

module.exports = {
  create,
  isValid,
};
