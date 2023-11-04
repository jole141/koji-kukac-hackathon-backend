import { IParkingSpot } from '@interfaces/parkingSimulation.interface';

export interface IParkingCluster {
  latitude: number;
  longitude: number;
  parkingClusterZone: string;
  parkingSpots: IParkingSpot[];
}
