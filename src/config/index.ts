import { bool, cleanEnv, port, str } from "envalid";
import { config } from "dotenv";
import * as process from "process";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({ devDefault: "development" }),
    LOG_DIR: str({ devDefault: "logs" }),
    LOG_FORMAT: str({ devDefault: "dev" }),
    PORT: port({ devDefault: 3001 }),
    ORIGIN: str({ devDefault: "*" }),
    CREDENTIALS: bool({ devDefault: true }),
    DB_CONNECTION_URI: str({
      devDefault: "mongodb://localhost:27017",
    }),
    DB_NAME: str({ devDefault: "dev" }),
    EXAMPLE_JOB_CRON_TIME: str({ devDefault: "*/1 * * * *" }),
  });
};

const env = validateEnv();

export = env;
