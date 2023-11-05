export class CarCreateDto {
  public make: string;
  public model: string;
  public city: string;
  public numbers: string;
  public text: string;
  public color: string;
  public type: 'sedan' | 'coupe' | 'suv';
}
