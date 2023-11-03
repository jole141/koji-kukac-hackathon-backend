import { NODE_ENV, DB_CONNECTION_URI, DB_NAME } from "@/config";
import { connect, set } from "mongoose";

export const dbConnection = {
  url: DB_CONNECTION_URI,
};

export async function initDb(): Promise<boolean> {
  if (NODE_ENV === "development") {
    set("debug", true);
  }

  await connect(dbConnection.url, {
    dbName: DB_NAME,
  });

  // MOCK DATA
  // await fillDatabase();

  return true;
}
