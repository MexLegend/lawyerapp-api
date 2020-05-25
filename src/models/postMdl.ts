import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const postModel = new SchemaM({
  content: {
    type: String,
    required: [true, 'El Contenido es requerido']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  external_sources: {
    type: String
  },
  img: {
    type: String,
    required: false
  },
  public_id: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: [true, 'El Titulo es requerido']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

postModel.plugin(mongoosePaginate);
export default model('Post', postModel);
