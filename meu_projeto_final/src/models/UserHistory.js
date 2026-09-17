import mongoose from 'mongoose';

const UserHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    episode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Episode',
      required: true
    },

    progress: {
      type: Number,
      min: 0,
      default: 0
    },

    watchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('UserHistory', UserHistorySchema);
