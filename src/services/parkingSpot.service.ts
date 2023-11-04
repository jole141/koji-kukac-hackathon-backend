import { ParkingSpotModel } from '@models/parkingSpot.model';

import { IParkingSpot } from '@interfaces/parkingSpot.interface';

class ParkingSpotService {
  public parkingSpotsCollection = ParkingSpotModel;

  public async getParkingSpots(): Promise<IParkingSpot[]> {
    return this.parkingSpotsCollection.find();
  }
}

export default ParkingSpotService;
