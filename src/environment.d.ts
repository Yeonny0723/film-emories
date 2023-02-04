declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET: string;
      DB_URL: string;
      GH_CLIENT: string;
      GH_SECRET: string;
      AWS_ID: string;
      AWS_SECRET: string;
    }
  }
}

export {};
