import mongoose, { Document, Schema } from 'mongoose'

interface ITask extends Document {
  title: string
  user: mongoose.Types.ObjectId
  completed: boolean
}

const taskSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
})

export default mongoose.model<ITask>('Task', taskSchema)
