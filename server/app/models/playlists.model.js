const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
