namespace NodeJS {
  interface ProcessEnv {
    // App
    PORT: number;
    // Database
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;

    S3_ACCESS_KEY:string;
    S3_SECRET_KEY:string;
    S3_BUCKET_NAME:string;
    S3_ENDPOINT:string;
  }
}
