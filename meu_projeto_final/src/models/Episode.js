import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    duration: {
      type: Number,
      required: true,
      min: 1
    },

    audioUrl: {
      type: String,
      required: true
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Episode', EpisodeSchema);
