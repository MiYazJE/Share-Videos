const Playlist = require('../models/playlists.model');

const getAllUserPlaylists = async (req, res) => {
  const { user: { id } } = req;
  const playlists = await Playlist.find({ user: id });
  const mapPlaylists = playlists.map(({ videos, title, _id }) => ({ videos, title, id: _id }));
  res.json({ playlists: mapPlaylists });
};

module.exports = {
  getAllUserPlaylists,
};
