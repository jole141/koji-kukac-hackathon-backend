export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  balance: number;
  cars: ICars[];
}

export interface ICars {
  licensePlate: string;
  brand: string;
  model: string;
  type: CarType;
}

export enum CarType {
  Sedan = 'Sedan',
  Coupe = 'Coupe',
  SUV = 'SUV',
}
