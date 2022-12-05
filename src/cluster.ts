import { Manager } from 'discord-hybrid-sharding';
import config from './config';
import { cfgLabel } from './utils/production';
import { blue, red } from 'chalk';

const manager = new Manager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: config[cfgLabel].discord.token
});

console.log(blue(`--------------------------------------- Hello, World!`));

manager.on('clusterCreate', c =>
    console.log(`[${blue('cluster')}]: Launched cluster with id "${red(c.id)}"`));

manager.spawn({ timeout: -1 });