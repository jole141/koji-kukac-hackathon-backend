import { Document, Schema, model } from 'mongoose';
import { IParkingSpotEvent } from '@interfaces/parkingSimulation.interface';

export const parkingSimulationEventModelSchema: Schema = new Schema({
  parkingSpotId: {
    type: String,
    unique: true,
  },
  occupied: {
    type: Boolean,
  },
  timestamp: {
    type: String,
  },
});

export const ParkingSimulationEventModel = model<IParkingSpotEvent & Document>('ParkingSimulationEvent', parkingSimulationEventModelSchema);
