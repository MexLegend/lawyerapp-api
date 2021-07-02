import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const rolesValidos = {
  values: ['ADMIN', 'ASSOCIATED', 'CLIENT', 'NEW'],
  message: '{VALUE} no es un rol valido'
};

const Schema = mongoose.Schema;

const userModel = new Schema({
  address: {
    type: String
  },
  biography: {
    type: String,
    required: false
  },
  cellPhone: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: [true, 'El Email es requerido'],
    index: true,
    unique: true,
    lowercase: true
  },
  firstName: {
    type: String,
    required: [true, 'El Nombre es requerido']
  },
  img: {
    type: String,
    required: false
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  lastName: {
    type: String,
    required: [true, 'Los Apellidos son requeridos']
  },
  lawyers: [
    {
      lawyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      required: false
    }
  ],
  password: {
    type: String,
    required: [true, 'La Contraseña es requerida']
  },
  practice_areas: [
    {
      practice_area: { type: Schema.Types.ObjectId, ref: 'PracticeArea' },
      required: false
    }
  ],
  public_id: {
    type: String,
    required: false
  },
  public_lawyer_id: {
    type: String,
    required: false
  },
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Rate',
      required: false
    }
  ],
  role: {
    type: String,
    default: 'NEW',
    enum: rolesValidos
  },
  rooms: [
    {
      room: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom'
      },
      type: {
        type: String,
        default: 'Personal'
      },
      required: false
    }
  ],
  status: {
    type: Boolean,
    default: true
  }
});

userModel.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userModel.plugin(mongoosePaginate);
export default mongoose.model('User', userModel);
