const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: Array,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
