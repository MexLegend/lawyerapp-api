import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const notificationModel = new SchemaM({
  created_at: {
    type: Date,
    default: Date.now
  },
  image_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  image_post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  show_buttons: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: [true, 'El titulo es requerido']
  },
  type: {
    type: String,
    required: [true, 'El tipo de notificación es requerido']
  },
  url_path: {
    type: String,
    required: [true, 'El path es requerido']
  },
  user_actor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user_actor_role: {
    type: String
  }
});

notificationModel.plugin(mongoosePaginate);
export default model('Notification', notificationModel);
