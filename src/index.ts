import { Client, Collection, GatewayIntentBits, Options } from 'discord.js';
import { Client as ClusterClient } from 'discord-hybrid-sharding';
import { cfgLabel } from './utils/production';
import config from './config';
import { runEventHandler } from './handler/eventHandler';
import { green, red } from 'chalk';

const client = new Client({
    /*
      @ For Typescript use Cluster.Client.getInfo() instead of Cluster.data
      @ - npmjs.com/discord-hybrid-sharding
    */
    shards: ClusterClient.getInfo().SHARD_LIST,
    shardCount: ClusterClient.getInfo().TOTAL_SHARDS,
    intents: [
        GatewayIntentBits.Guilds
    ],
    makeCache: Options.cacheWithLimits({
        MessageManager: 0,
        ReactionManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        GuildScheduledEventManager: 0,
        PresenceManager: 0,
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0,
        GuildEmojiManager: 0,
        AutoModerationRuleManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildForumThreadManager: 0,
        GuildTextThreadManager: 0,
        GuildStickerManager: 0,
        VoiceStateManager: 0
    })
});

runEventHandler(client);

client.commands = new Collection();
client.cluster = new ClusterClient(client);

client.login(config[cfgLabel].discord.token);

const exit = () => {
    client.destroy();
    console.log(`\n[${red('process')}]: Process exited with code ${green(0)}`)
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('exit', exit);