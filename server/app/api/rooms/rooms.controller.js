async function create(req, res) {
  const { name } = req.body;
  const { roomsCtrl } = req.app.locals;
  const room = await roomsCtrl.create(name);
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
