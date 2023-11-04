import { ParkingSpotModel } from '@models/parkingSpot.model';

import { IParkingSpot } from '@interfaces/parkingSpot.interface';
import { ParkingClusterModel } from '@models/parkingCluster.model';

class ParkingSpotService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public async getParkingSpots(): Promise<IParkingSpot[]> {
    return this.parkingSpotsCollection.find();
  }

  async deleteParkingSpot(id: string) {
    const parkingSpot = await this.parkingSpotsCollection.findById(id);
    const parkingCluster = await this.parkingClusterCollection.findById(parkingSpot.cluster);
    if (parkingCluster.parkingSpots.length === 1) {
      await this.parkingClusterCollection.findByIdAndDelete(parkingCluster._id);
    }

    return this.parkingSpotsCollection.findByIdAndDelete(parkingSpot._id);
  }
}

export default ParkingSpotService;
