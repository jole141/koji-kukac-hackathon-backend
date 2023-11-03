import { logger } from "@utils/logger";
import { ExampleModel } from "@models/test.model";

export const exampleJob = async () => {
  try {
    await ExampleModel.create({ test: new Date().toISOString() });
  } catch (e) {
    logger.error("Error in exampleJob", e);
  }
};
