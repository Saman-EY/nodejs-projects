import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt="Jwt"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: 3000,
}));
const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: "admin",
  database: "auth-otp",
}));

const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: "lkjdfdiutsdkjhfg8787ijhdf8723o5098347yerkfdiu",
  refreshTokenSecret: "akjhdncvbhjeriughyuyge87092348754klgkfdhfddf",
}));

export const configurations = [AppConfig, DbConfig, JwtConfig];
