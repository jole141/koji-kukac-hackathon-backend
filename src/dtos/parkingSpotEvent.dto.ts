import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class ParkingSpotEventDto {
  @IsUUID()
  public _id: string;

  @IsBoolean()
  public isOccupied: boolean;

  @IsString()
  public time: string;
}
