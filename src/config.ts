export enum NODE_ENVS {
  dev = "dev",
  prod = "prod",
}

export const GET_FRONTEND_URL = () => {
  if (process.env.NODE_ENV_SECONDARY === NODE_ENVS.dev) {
    return "http://localhost:5173";
  } else return "prod_url";
};

export const winston_format = (key: string, msg: string): string =>
  `key => ${key} *msg: ${msg}`;
