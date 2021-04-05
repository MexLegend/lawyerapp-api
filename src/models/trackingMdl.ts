import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const trackingModel = new SchemaM({
  date: {
    type: Date,
    default: Date.now
  },
  evidenceId: {
    type: Schema.Types.ObjectId,
    ref: 'Evidence'
  },
  trackingEvidences: [
    {
      evidence: {
        type: Schema.Types.ObjectId,
        ref: 'Evidence'
      }
    }
  ],
  message: {
    type: String
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  },
  trackingNotes: [
    {
      note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
      }
    }
  ],
  status: {
    default: 'ACTIVE',
    type: String
  },
  volume: {
    type: Schema.Types.ObjectId,
    ref: 'Volume',
    required: true
  }
});

trackingModel.plugin(mongoosePaginate);
export default model('Tracking', trackingModel);
