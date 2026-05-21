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

    ZARINPAL_VERIFY_URL: string;
    ZARINPAL_REQUEST_URL: string;
    ZARINPAL_GATEWAY_URL: string;
    ZARINPAL_MERCHANT_ID: string;
  }
}
