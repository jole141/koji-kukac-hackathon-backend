import { Document, model, Schema } from 'mongoose';
import { IUser } from '@interfaces/user.interface';

const userModelSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  cars: [
    {
      make: {
        type: String,
      },
      model: {
        type: String,
      },
      city: {
        type: String,
      },
      numbers: {
        type: String,
      },
      text: {
        type: String,
      },
      color: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],
});

export const UserModel = model<IUser & Document>('User', userModelSchema);
