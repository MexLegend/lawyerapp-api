import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const trackingModel = new SchemaM({
  comment: {
      type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  documents: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      document: {
        type: String,
      },
      numV: Number,
    },
  ],
  file: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  status: {
    type: String,
  },
  track: {
    type: Number,
  },
  volumes: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      num: {
        type: Number,
      },
    },
  ]
});

trackingModel.plugin(mongoosePaginate);
export default model('Tracking', trackingModel);
