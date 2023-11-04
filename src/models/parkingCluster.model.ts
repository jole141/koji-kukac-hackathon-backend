import { Document, model, Schema } from 'mongoose';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';
import { parkingSpotModelSchema } from '@models/parkingSpot.model';

const parkingClusterModelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    default: 'Unknown',
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
  occupancy: [
    {
      dayOfWeek: String,
      hours: [
        {
          hour: Number,
          occupancy: Number,
        },
      ],
    },
  ],
});

export const ParkingClusterModel = model<IParkingCluster & Document>('ParkingCluster', parkingClusterModelSchema);
