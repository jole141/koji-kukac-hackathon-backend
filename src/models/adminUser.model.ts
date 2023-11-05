import { Document, model, Schema } from 'mongoose';
import { IUser } from '@interfaces/user.interface';

const adminUserSchema: Schema = new Schema({
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
});

export const AdminUserModel = model<IUser & Document>('AdminUser', adminUserSchema);
