import { Command } from "../typings";
import { readdirSync } from 'fs';

import { REST, Routes } from 'discord.js';
import config from "../config";
import { cfgLabel } from "../utils/production";
import { UploadType } from "../typings/enums";

export const Rest = new REST().setToken(config[cfgLabel].discord.token);

export const fetchCommands = async (): Promise<Command[]> => {
    const commands: string[] = await readdirSync(`${process.cwd()}/dist/commands`);
    
    return commands.map((commandName) =>
        require(`../commands/${commandName}`).command as Command);
}

export const uploadCommands = async (commands: Command[], type?: UploadType): Promise<unknown> => {
    if (type === UploadType.guild)
        return await Rest.put(
            Routes.applicationGuildCommands(config[cfgLabel].discord.clientID, config['s'].devGuildID),
            { body: commands }
        );
    else
        return await Rest.put(
            Routes.applicationCommands(config[cfgLabel].discord.clientID),
            { body: commands }
        );
}
