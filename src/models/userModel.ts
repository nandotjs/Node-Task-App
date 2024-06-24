import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  password: string;
  tasks: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }]
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
