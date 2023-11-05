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
  make: string;
  model: string;
  city: string;
  numbers: string;
  text: string;
  color: string;
  type: 'sedan' | 'coupe' | 'suv';
}
