export const getEnvVariable: (env: string) => string = (
  env: string
): string => {
  if (process.env[env]) {
    return process.env[env];
  }
  throw new Error(`Environment variable ${env} not found.`);
};
