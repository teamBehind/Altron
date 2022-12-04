import { Guild } from "discord.js";
import { Event } from "../typings";
import { greeter_webhook } from "./guildCreate";
import _inCommand from "../utils/_inCommand";

export const event: Event = {
    name: 'guildDelete',
    run: async (client, guild: Guild) => {
        greeter_webhook.send({
            embeds: [
                _inCommand.embeds.long(`✋ | Bye Guild`, _inCommand.colors.default)([
                    { 
                        name: 'Name',
                        value: guild.name,
                        inline: true
                    },
                    {
                        name: 'ID',
                        value: guild.id,
                        inline: true
                    },
                    {
                        name: 'Members',
                        value: guild.memberCount.toLocaleString(),
                        inline: true
                    }
                ]).setThumbnail(guild.iconURL()).setTimestamp().setFooter({
                    text: (guild?.ownerId != null ? guild.ownerId : 'Unknown') + ` / ${client.guilds.cache.size} Guilds`,
                })
            ]
        })
    }
}