import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const chatRoomModel = new SchemaM({
  created_at: {
    type: Date,
    default: Date.now
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  members: [
    {
      member: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        default: 'Member'
      }
    }
  ],
  updated_at: {
    type: Date,
    default: Date.now
  }
});

chatRoomModel.plugin(mongoosePaginate);
export default model('ChatRoom', chatRoomModel);
