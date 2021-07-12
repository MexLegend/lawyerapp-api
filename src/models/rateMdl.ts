import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const rateModel = new Schema({
  comment: {
    type: String,
    default: '',
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
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Rate', rateModel);
