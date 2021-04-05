import { model, Schema } from 'mongoose';

const SchemaM = Schema;

const volumeModel = new SchemaM({
    case: {
        type: Schema.Types.ObjectId,
        ref: 'Case',
        required: true
      },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'ACTIVE'
  }
});

export default model('Volume', volumeModel);
