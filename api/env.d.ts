declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URI: string;
    HOST_URL: string;
    EMAIL_HOST: string;
    EMAIL_PASS: string;
    REDIS_URI: string;
    REF_SEC: string;
    ACC_SEC: string;
  }
}
