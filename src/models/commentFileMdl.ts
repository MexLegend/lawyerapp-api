import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const commentFileModel = new SchemaM({
  date: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String
  }
});

commentFileModel.plugin(mongoosePaginate);
export default model('CommentFile', commentFileModel);
