export class ParkingClusterCreateDto {
  public name: string;
  public address: string;
  public latitude: number;
  public longitude: number;
  public parkingClusterZone: string;
  public numberOfParkingSpots: number;
  public dynamicPricing: boolean;
  public priceIncreaseThreshold: number;
  public priceIncreaseAmount: number;
  public priceIncreaseInterval: number;
}
