import { Document, Schema, model } from 'mongoose';
import { IParkingSpot } from '@interfaces/parkingSimulation.interface';

export const parkingSpotModelSchema: Schema = new Schema({
  _id: {
    type: String,
    unique: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  parkingSpotZone: {
    type: String,
  },
  occupied: {
    type: Boolean,
  },
  occupiedTimestamp: {
    type: String,
  },
});

export const ParkingSpotModel = model<IParkingSpot & Document>('ParkingSpot', parkingSpotModelSchema);
