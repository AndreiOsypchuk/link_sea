declare namespace NodeJS {
  export interface ProcessEnv {
    DB_TEST: string;
    DB_PROD: string;
    HOST_URL: string;
    DEV: boolean;
    EMAIL_HOST: string;
    EMAIL_PASS: string;
    REDIS_URI: string;
    REF_SEC: string;
  }
}
