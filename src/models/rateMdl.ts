import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const rateModel = new Schema({
  comment: {
    comment: { type: String, default: '' },
    created_at: {
      type: Date,
      default: Date.now
    },
    required: false
  },
  externalModelType: {
    type: String
  },
  data_id: {
    type: Schema.Types.ObjectId,
    ref: 'externalModelType'
  },
  rating: {
    type: Number
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('Rate', rateModel);
