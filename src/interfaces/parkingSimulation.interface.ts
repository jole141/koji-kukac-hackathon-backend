export interface IParkingSpot {
  _id: string;
  latitude: number;
  longitude: number;
  parkingSpotZone: string;
  occupied: boolean;
  occupiedTimestamp: string;
}

export type IParkingSpotSimulation = Omit<IParkingSpot, '_id'> & { id: string };

export interface IParkingSpotEvent {
  parkingSpotId: string;
  occupied: boolean;
  timestamp: string;
}
