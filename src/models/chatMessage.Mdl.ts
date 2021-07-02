import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const chatMessageModel = new SchemaM({
  chat_room_id: {
    type: Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: [true, 'The messages room is required']
  },
  messages: [
    {
      attachments: [
        {
          type: {
            type: String
          },
          file_id: {
            type: Schema.Types.ObjectId,
            ref: 'Files'
          }
        }
      ],
      author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The messages author is required']
      },
      created_at: {
        type: Date,
        default: Date.now
      },
      deleted: {
        is_deleted: {
          type: Boolean
        },
        deleted_by: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      },
      message: {
        type: String
      },
      status: {
        type: String
      },
      updated_at: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

chatMessageModel.plugin(mongoosePaginate);
export default model('ChatMessage', chatMessageModel);
