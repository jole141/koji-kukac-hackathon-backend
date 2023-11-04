import { Document, model, Schema } from 'mongoose';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';
import { parkingSpotModelSchema } from '@models/parkingSpot.model';

const parkingClusterModelSchema: Schema = new Schema({
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
  parkingClusterZone: {
    type: String,
  },
  parkingSpots: [{ type: parkingSpotModelSchema }],
});

export const ParkingClusterModel = model<IParkingCluster & Document>('ParkingCluster', parkingClusterModelSchema);
