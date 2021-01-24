import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const evidenceModel = new SchemaM({
  case: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  evidences: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      name: {
        type: String
      },
      path: {
        type: String
      },
      public_id: {
        type: String,
        required: false
      },
      size: {
        type: String
      },
      status: {
        type: String,
        default: 'PUBLIC'
      }
    }
  ]
});

evidenceModel.plugin(mongoosePaginate);
export default model('Evidence', evidenceModel);
