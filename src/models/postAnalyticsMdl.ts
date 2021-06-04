import { model, Schema } from 'mongoose';

const SchemaM = Schema;

const postAnalyticsModel = new SchemaM({
  comments: [
    {
      comment: {
        type: String
      },
      date: { type: Date, default: Date.now },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  dislikes: {
    type: Number
  },
  likes: {
    type: Number
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reactions: [
    {
      date: { type: Date, default: Date.now },
      reaction: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
});

export default model('PostAnalytics', postAnalyticsModel);
