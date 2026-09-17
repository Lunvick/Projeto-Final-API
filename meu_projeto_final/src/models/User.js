import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.set('toJSON', {
  transform: (document, returned) => {
    delete returned.password;
    delete returned.__v;
    return returned;
  }
});

export default mongoose.model('User', UserSchema);
