import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const documentFileModel = new SchemaM({
  date: {
    type: Date,
    default: Date.now
  },
  uri: {
    type: String
  }
});

documentFileModel.plugin(mongoosePaginate);
export default model('DocumentFile', documentFileModel);
