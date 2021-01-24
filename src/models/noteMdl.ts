import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const noteModel = new SchemaM({
  case: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  notes: [
    {
      affair: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      },
      message: {
        type: String
      },
      status: {
        type: String,
        default: 'PUBLIC'
      }
    }
  ]
});

noteModel.plugin(mongoosePaginate);
export default model('Note', noteModel);
