import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

// Comment Schema
export const commentSchema = new mongoose.Schema({
  subject: { type: String, required: true, maxlength: 50},
  text: { type: String, required: true, maxlength: 350 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

commentSchema.plugin(mongooseUniqueValidator)
export const Comment = mongoose.model('Comment', commentSchema)