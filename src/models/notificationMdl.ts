import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const notificationModel = new SchemaM({
    body: {
        type: String,
        required: [true, 'El Contenido es requerido']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    icon: {
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
    typeU: {
        type: String,
        required: [true, 'El Tipo es requerido']
    },
    view: {
        type: Boolean,
        default: false
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});

notificationModel.plugin(mongoosePaginate);
export default model('Notification', notificationModel);
