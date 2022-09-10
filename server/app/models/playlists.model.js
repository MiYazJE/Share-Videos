const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: Array,
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
