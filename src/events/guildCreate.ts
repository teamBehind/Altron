import { Guild, WebhookClient } from "discord.js";
import { Event } from "../typings";
import config from '../config';
import _inCommand from "../utils/_inCommand";

export const event: Event = {
    name: 'guildCreate',
    run: async (client, guild: Guild) => {
        const owner = await guild.fetchOwner().catch(() => null);

        greeter_webhook.send({
            embeds: [
                _inCommand.embeds.long(`📥 | New Guild!`, _inCommand.colors.default)([
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
                    text: (owner ? `${owner.user.tag} (${owner.user.id})` : 'Unknown') + ` / ${client.guilds.cache.size} Guilds`,
                    iconURL: owner ? owner.user.displayAvatarURL() : undefined
                })
            ]
        })
    }
}

export const greeter_webhook = new WebhookClient({ url: config['s'].greeter });