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
  pricePerHour: {
    type: Number,
    required: true,
  },
  dynamicPricing: {
    type: Boolean,
    default: false,
  },
  priceIncreaseThreshold: {
    type: Number,
    default: 0.7,
  },
  priceIncreaseAmount: {
    type: Number,
    default: 0.2,
  },
  priceIncreaseInterval: {
    type: Number,
    default: 0.1,
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
