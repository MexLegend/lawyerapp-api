import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const caseModel = new SchemaM({
  actor: {
    type: String,
    required: [true, 'El Actor es requerido']
  },
  affair: {
    type: String,
    required: [true, 'El Asunto es requerido']
  },
  assigned_client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El Cliente es requerido']
  },
  defendant: {
    type: String,
    required: [true, 'El Demandante es requerido']
  },
  extKey: {
    type: String
  },
  intKey: {
    type: String,
    required: [true, 'La Clave Interna es requerida']
  },
  observations: {
    type: String
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'ACTIVE'
  },
  third: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

caseModel.plugin(mongoosePaginate);
export default model('Case', caseModel);
