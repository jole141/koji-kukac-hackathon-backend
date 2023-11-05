import { ParkingSpotModel } from '@models/parkingSpot.model';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';
import { haversine } from '@utils/util';
import { ObjectId } from 'mongodb';
import { getAddressFromLongLat } from '@utils/getAddressFromLongLat';

import { ParkingClusterCreateDto } from '@dtos/parkingClusterCreate.dto';
import ParkingSpotService from '@services/parkingSpot.service';
import { DynamicPricingParametersDto } from '@dtos/dynamicPricingParameters.dto';

function getPricePerHour(parkingSpotZone: string) {
  switch (parkingSpotZone) {
    case 'Zone1':
      return 2;
    case 'Zone2':
      return 1.5;
    case 'Zone3':
      return 1;
    case 'Zone4':
      return 0.5;
    default:
      return 0;
  }
}

function calculateDynamicPrice(parkingCluster: any) {
  if (!parkingCluster.dynamicPricing) {
    return parkingCluster.pricePerHour;
  }
  const occupancyPercentage = parkingCluster.occupancyPercentage;
  if (occupancyPercentage < parkingCluster.priceIncreaseThreshold) {
    return parkingCluster.pricePerHour;
  }
  const priceIncreaseAmount = parkingCluster.priceIncreaseAmount;
  const priceIncreaseInterval = parkingCluster.priceIncreaseInterval;
  const priceIncreasePercentage = (occupancyPercentage - parkingCluster.priceIncreaseThreshold) / priceIncreaseInterval;
  return parkingCluster.pricePerHour * (1 + priceIncreasePercentage * priceIncreaseAmount);
}

class ParkingClusterService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public parkingSpotService = new ParkingSpotService();
  public getParkingClusterById(id: string) {
    const parkingCluster: any = this.parkingClusterCollection.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: '$parkingSpots',
      },
      {
        $group: {
          _id: '$_id',
          totalOccupied: { $sum: { $cond: { if: '$parkingSpots.occupied', then: 1, else: 0 } } },
          totalSpots: { $sum: 1 },
          hasAvailable: { $max: { $eq: ['$parkingSpots.occupied', false] } },
          longitude: { $first: '$longitude' },
          latitude: { $first: '$latitude' },
          name: { $first: '$name' },
          address: { $first: '$address' },
          parkingClusterZone: { $first: '$parkingClusterZone' },
          pricePerHour: { $first: '$pricePerHour' },
          parkingSpots: { $push: '$parkingSpots' },
          occupancy: { $first: '$occupancy' },
        },
      },
      {
        $project: {
          _id: 1,
          occupancyPercentage: { $divide: ['$totalOccupied', '$totalSpots'] },
          available: '$hasAvailable',
          numOfAvailableSpots: { $subtract: ['$totalSpots', '$totalOccupied'] },
          longitude: 1,
          latitude: 1,
          name: 1,
          address: 1,
          parkingClusterZone: 1,
          pricePerHour: 1,
          parkingSpots: 1,
          occupancy: 1,
        },
      },
    ]);
    parkingCluster.pricePerHour = calculateDynamicPrice(parkingCluster);
    return parkingCluster;
  }

  public async getParkingClusters(): Promise<IParkingCluster[]> {
    const parkingClusters: IParkingCluster[] = await this.parkingClusterCollection.aggregate([
      {
        $unwind: '$parkingSpots',
      },
      {
        $group: {
          _id: '$_id',
          totalOccupied: { $sum: { $cond: { if: '$parkingSpots.occupied', then: 1, else: 0 } } },
          totalSpots: { $sum: 1 },
          hasAvailable: { $max: { $eq: ['$parkingSpots.occupied', false] } },
          longitude: { $first: '$longitude' },
          latitude: { $first: '$latitude' },
          name: { $first: '$name' },
          address: { $first: '$address' },
          pricePerHour: { $first: '$pricePerHour' },
          parkingClusterZone: { $first: '$parkingClusterZone' },
        },
      },
      {
        $project: {
          _id: 1,
          occupancyPercentage: { $divide: ['$totalOccupied', '$totalSpots'] },
          available: '$hasAvailable',
          numOfAvailableSpots: { $subtract: ['$totalSpots', '$totalOccupied'] },
          longitude: 1,
          latitude: 1,
          name: 1,
          address: 1,
          pricePerHour: 1,
          parkingClusterZone: 1,
        },
      },
    ]);
    parkingClusters.forEach(parkingCluster => {
      parkingCluster.pricePerHour = calculateDynamicPrice(parkingCluster);
    });
    return parkingClusters;
  }

  public async initParkingClusters(): Promise<IParkingCluster[]> {
    const parkingSpots = await this.parkingSpotsCollection.find({});
    let parkingClustersNumber = 1;
    for (const parkingSpot of parkingSpots) {
      if (parkingSpot.cluster !== undefined) {
        continue;
      }
      //const address = await getAddressFromLongLat(parkingSpot.longitude, parkingSpot.latitude);
      const parkingCluster = {
        name: `Parking cluster ${parkingClustersNumber++}`,
        address: 'address',
        latitude: parkingSpot.latitude,
        longitude: parkingSpot.longitude,
        parkingClusterZone: parkingSpot.parkingSpotZone,
        pricePerHour: getPricePerHour(parkingSpot.parkingSpotZone),
        parkingSpots: [parkingSpot],
        occupancy: [],
      };
      const savedParkingCluster = await this.parkingClusterCollection.create(parkingCluster);
      parkingSpot.cluster = savedParkingCluster._id;
      await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot._id, { cluster: savedParkingCluster._id });
      for (const parkingSpot1 of parkingSpots) {
        if (parkingSpot1.cluster !== undefined || parkingSpot._id === parkingSpot1._id) {
          continue;
        }
        if (this.isInCluster(parkingCluster, parkingSpot1)) {
          parkingSpot1.cluster = savedParkingCluster._id;
          await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot1._id, { cluster: savedParkingCluster._id });
          await this.parkingClusterCollection.findByIdAndUpdate(savedParkingCluster._id, {
            $push: { parkingSpots: parkingSpot1 },
          });
          await this.updateClusterCoordinates(savedParkingCluster._id);
        }
      }
    }
    return undefined;
  }

  public async updateClusterCoordinates(uuid: string) {
    let longitudeSum = 0;
    let latitudeSum = 0;
    let count = 0;
    const parkingCluster = await this.parkingClusterCollection.findOne({ uuid: uuid });
    parkingCluster.parkingSpots.forEach(parkingSpace => {
      longitudeSum += parkingSpace.longitude;
      latitudeSum += parkingSpace.latitude;
      count++;
    });
    parkingCluster.longitude = longitudeSum / count;
    parkingCluster.latitude = latitudeSum / count;
    await this.parkingClusterCollection.findByIdAndUpdate(parkingCluster._id, parkingCluster);
  }

  private isInCluster(parkingCluster: any, ps2: any) {
    if (parkingCluster.parkingClusterZone !== ps2.parkingSpotZone) {
      return false;
    }
    return haversine(parkingCluster.latitude, parkingCluster.longitude, ps2.latitude, ps2.longitude) < 50;
  }

  async createParkingCluster(parkingClusterCreateDto: ParkingClusterCreateDto) {
    const parkingSpots = [];
    for (let i = 0; i < parkingClusterCreateDto.numberOfParkingSpots; i++) {
      const parkingSpot = await this.parkingSpotService.createParkingSpot({
        latitude: parkingClusterCreateDto.latitude,
        longitude: parkingClusterCreateDto.longitude,
        parkingSpotZone: parkingClusterCreateDto.parkingClusterZone,
      });
      parkingSpots.push(parkingSpot);
    }
    const parkingCluster = {
      name: parkingClusterCreateDto.name,
      address: parkingClusterCreateDto.address,
      latitude: parkingClusterCreateDto.latitude,
      longitude: parkingClusterCreateDto.longitude,
      parkingClusterZone: parkingClusterCreateDto.parkingClusterZone,
      parkingSpots: parkingSpots,
      pricePerHour: getPricePerHour(parkingClusterCreateDto.parkingClusterZone),
      dynamicPricing: parkingClusterCreateDto.dynamicPricing,
      priceIncreaseThreshold: parkingClusterCreateDto.priceIncreaseThreshold,
      priceIncreaseAmount: parkingClusterCreateDto.priceIncreaseAmount,
      priceIncreaseInterval: parkingClusterCreateDto.priceIncreaseInterval,
    };

    const newParkingCluster: any = this.parkingClusterCollection.create(parkingCluster);
    newParkingCluster.pricePerHour = calculateDynamicPrice(newParkingCluster);
    return newParkingCluster;
  }

  async deleteParkingCluster(id: string) {
    const parkingCluster = await this.parkingClusterCollection.findById(id);
    for (const parkingSpot of parkingCluster.parkingSpots) {
      await this.parkingSpotService.deleteParkingSpot(parkingSpot._id);
    }
    return this.parkingClusterCollection.findByIdAndDelete(id);
  }

  async updateParkingClusterName(id: string, name: any) {
    const parkingCluster = await this.parkingClusterCollection.findById(id);
    parkingCluster.name = name;
    const newParkingCluster: any = this.parkingClusterCollection.findByIdAndUpdate(id, parkingCluster);
    newParkingCluster.pricePerHour = calculateDynamicPrice(newParkingCluster);
    return newParkingCluster;
  }

  async updateDynamicPricingParameters(id: string, dynamicPricingParameters: DynamicPricingParametersDto) {
    const parkingCluster = await this.parkingClusterCollection.findById(id);
    parkingCluster.dynamicPricing = dynamicPricingParameters.dynamicPricing;
    parkingCluster.priceIncreaseThreshold = dynamicPricingParameters.priceIncreaseThreshold;
    parkingCluster.priceIncreaseAmount = dynamicPricingParameters.priceIncreaseAmount;
    parkingCluster.priceIncreaseInterval = dynamicPricingParameters.priceIncreaseInterval;

    const newParkingCluster: any = this.parkingClusterCollection.findByIdAndUpdate(id, parkingCluster);
    newParkingCluster.pricePerHour = calculateDynamicPrice(newParkingCluster);
    return newParkingCluster;
  }
}

export default ParkingClusterService;
