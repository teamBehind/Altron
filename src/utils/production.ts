export const isDev = process.env.npm_lifecycle_event === 'dev';
export const cfgLabel = isDev ? 'd' : 'p';