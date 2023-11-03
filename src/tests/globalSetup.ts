import { MongoMemoryServer } from 'mongodb-memory-server';

export = async function globalSetup() {
  // it's needed in global space, because we don't want to create a new instance every test-suite
  const instance = await MongoMemoryServer.create();
  const url = new URL(instance.getUri());
  (global as any).__MONGOINSTANCE = instance;
  process.env.DB_HOST = url.hostname;
  process.env.DB_PORT = url.port;
  process.env.DB_DATABASE = 'test';
};
