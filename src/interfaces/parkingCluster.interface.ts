import { IParkingSpot } from '@interfaces/parkingSimulation.interface';

export interface IParkingCluster {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  parkingClusterZone: string;
  parkingSpots: IParkingSpot[];
}
