import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const usersNotificationModel = new SchemaM({
  allowed_roles: [
    {
      type: String
    }
  ],
  is_viewed: {
    type: Boolean,
    default: false
  },
  notification_id: {
    type: Schema.Types.ObjectId,
    ref: 'Notification',
    required: [true, 'El ID de la notificación es requerido']
  },
  user_receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  users_viewed: [
    {
      viewer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      viewed_at: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

usersNotificationModel.plugin(mongoosePaginate);
export default model('UserNotification', usersNotificationModel);
