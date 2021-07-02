import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const newsLetterModel = new SchemaM({
  email: {
    type: String,
    required: [true, 'El Email es requerido']
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
  },
  suscribed_at: {
    type: Date,
    default: Date.now
  }
});

newsLetterModel.plugin(mongoosePaginate);
export default model('NewsLetter', newsLetterModel);
