import { Client as ClusterClient } from 'discord-hybrid-sharding';
import { ChatInputCommandInteraction, Client, ClientEvents, Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { CommandCategory } from './enums';
import _inCommand from '../utils/_inCommand';

export type Command = RESTPostAPIChatInputApplicationCommandsJSONBody & {
    emoji?: string;
    category?: CommandCategory;
    run: (client: Client, interaction: ChatInputCommandInteraction, _: CommandFunctions) => Promise<any>;
};

export type CommandFunctions = typeof _inCommand;

export interface Event {
    name: keyof ClientEvents;
    run: (client: Client, ...args: any[]) => Promise<void>;
}

declare module "discord.js" {
    interface Client {
        commands: Collection<Command["name"], Command>;
        cluster: ClusterClient;
    }
}

export type Animal = 'dog' | 'cat' | 'panda' | 'red_panda' | 'bird' | 'koala';

export type MemeResult = { url: string; title: string }