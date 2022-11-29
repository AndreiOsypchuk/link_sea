declare namespace NodeJS {
  export interface ProcessEnv {
    DB_TEST: string;
    DB_PROD: string;
    DEV: boolean;
  }
}
