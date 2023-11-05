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
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  balance: {
    type: Number,
  },
  cars: [
    {
      licensePlate: String,
      brand: String,
      model: String,
      type: String,
    },
  ],
});

export const UserModel = model<IUser & Document>('User', userModelSchema);
