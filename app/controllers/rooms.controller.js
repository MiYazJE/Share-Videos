
module.exports = {
    create,
    isValid
};

function create(req, res) {
    const { name } = req.body;
    const { roomsCtrl } = req.app.locals;
    const room = roomsCtrl.create(name);
    res.json(room);
}

function isValid(req, res) {
    const { id } = req.params;
    const { roomsCtrl } = req.app.locals;
    const isValid = Boolean(roomsCtrl.get(id));
    res.json(isValid);
}