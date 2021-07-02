import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const contactModel = new SchemaM({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El Usuario es requerido']
  },
  contacts: [
    {
      contact: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
});

contactModel.plugin(mongoosePaginate);
export default model('Contact', contactModel);
