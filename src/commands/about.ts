import config from "../config";
import { locale, prepare_description } from "../locale/init";
import { Command } from "../typings";
import { CommandCategory } from "../typings/enums";
import { GuildScheduledEvent, User, version as djsVersion } from "discord.js";

export const command: Command = {
    name: 'about',
    emoji: 'ℹ️',
    category: CommandCategory.Info,
    description: locale.about.description.en,
    description_localizations: prepare_description(locale.about.description),
    run: async (client, interaction, _) => {
        let devs: string[] = config['s'].devs;

        for (let dev of devs) {
            let user = await client.users.fetch(dev);
            devs[devs.indexOf(dev)] = user.tag;
        }

        const extraFields = devs.map((n) => {
            return {
                name: `${_(locale.base.developer)} (${devs.indexOf(n) + 1})`,
                value: n,
                inline: true
            }
        })

        const users = (await client.cluster
                .broadcastEval(c => c.users.cache.size)).reduce((prev, val) => prev + val, 0).toLocaleString();

        const guilds = (await client.cluster
                .broadcastEval(c => c.guilds.cache.size)).reduce((prev, val) => prev + val, 0).toLocaleString();

        return await interaction.reply({
            embeds: [
                _.embeds.long(`ℹ️ | ${_(locale.about.about)}`, _.colors.default)([{
                    name: _(locale.base.writtenIn),
                    value: 'TypeScript',
                    inline: true
                }, {
                    name: _(locale.base.poweredBy, { service: '' }),
                    value: `Discord.js ${djsVersion}\n Node.js ${process.version}`,
                    inline: true
                }, {
                    name: _(locale.base.sourceCode),
                    value: `[GitHub](${config['s'].github_repo})`,
                    inline: true
                }, ...extraFields, {
                    name: _(locale.support.support_server),
                    value: `[${_(locale.base.clickHere)}](${config['s'].support_server})`,
                    inline: true
                }, {
                    name: _(locale.base.users),
                    value: users,
                    inline: true
                }, {
                    name: _(locale.base.guilds),
                    value: guilds,
                    inline: true
                }]).setThumbnail(client.user.displayAvatarURL()).setFooter({
                    text: 'Altron | Made with ❤️ by the developers',
                    iconURL: client.user.displayAvatarURL()
                })
            ]
        })
    }
}