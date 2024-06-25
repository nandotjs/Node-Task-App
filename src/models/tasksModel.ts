import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  user: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
