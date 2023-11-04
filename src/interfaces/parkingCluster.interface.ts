import { IParkingSpot } from '@interfaces/parkingSimulation.interface';

export interface IParkingCluster {
  _id: string;
  latitude: number;
  longitude: number;
  parkingClusterZone: string;
  parkingSpots: IParkingSpot[];
}
