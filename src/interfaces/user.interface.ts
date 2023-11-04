export interface IUser {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  balance: number;
  email: string;
  cars: Cars[];
}

interface Cars {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  type: CarType;
}

enum CarType {
  Sedan = 'Sedan',
  Coupe = 'Coupe',
  SUV = 'SUV',
}
