import mongoose, { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  section: { type: String, enum: ['news', 'gallery'], required: true },
  type: { 
    type: String, 
    enum: ['news', 'article', 'blog', 'voz', 'sucesso', 'comunicado', 'photo', 'video', 'podcast', 'publication'], 
    required: true 
  },
  date: { type: String, required: true },
  location: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  mediaUrl: { type: String, default: '' },
  views: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

const Post = models.Post || model('Post', PostSchema);
export default Post;
