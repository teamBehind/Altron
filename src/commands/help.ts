import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { Command } from "../typings";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'help',
    description: locale.help.description.en,
    description_localizations: prepare_description(locale.help.description),
    emoji: '❓',
    category: CommandCategory.Info,
    options: [
        {
            name: 'command',
            description: locale.options.command_name.en,
            description_localizations: prepare_description(locale.options.command_name),
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true
        }
    ],
    run: async (client, interaction, _) => {
        const commandName = interaction.options.getString('command', false);

        if (commandName == null) {
            const categories: CommandCategory[] = client.commands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i);

            return interaction.reply({
                embeds: [
                    _.embeds.long(`❓ | ${_(locale.help.help_menu)}`, _.colors.default)(categories.map(category => {
                        return {
                            name: _(locale.categories[category]),
                            value: client.commands.filter(c => c.category === category).map(c => `\`${c.name}\``).join(', ')
                        }
                    })).setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            });
        } else {
            const command = await client.commands.get(commandName);

            if (command == null)
                return interaction.reply({
                    embeds: [
                        _.embeds.short(_(locale.base.noResults), _.colors.error)()
                    ]
                });

            return interaction.reply({
                embeds: [
                    _.embeds.long(`${command.emoji} | "/${command.name}"`, _.colors.default)([
                        {
                            name: _(locale.base.description),
                            value: _(locale[command.name].description),
                            inline: true
                        }, {
                            name: _(locale.base.category),
                            value: _(locale.categories[command.category]),
                            inline: true
                        }, {
                            name: _(locale.base.options),
                            value: (command.options != null && Array.isArray(command.options) ? command.options.filter(o => o.required)?.map(o => `\`${o.name}\``).join(', ') : _(locale.base.none)),
                            inline: true
                        }
                    ]).setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            });
        }
    }
}