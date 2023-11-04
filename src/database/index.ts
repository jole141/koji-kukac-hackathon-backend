import { NODE_ENV, DB_CONNECTION_URI, DB_NAME } from '@/config';
import { connect, set } from 'mongoose';
import ParkingSimulationService from '@services/parkingSimulation.service';

export const dbConnection = {
  url: DB_CONNECTION_URI,
};

export async function initDb(): Promise<boolean> {
  if (NODE_ENV === 'development') {
    set('debug', true);
  }

  await connect(dbConnection.url, {
    dbName: DB_NAME,
  });

  await fillDatabase();

  return true;
}

async function fillDatabase() {
  const parkingSimulationService = new ParkingSimulationService();
  await parkingSimulationService.fetchAndSaveParkingSpots();
}
