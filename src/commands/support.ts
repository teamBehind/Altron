import { config } from "process";
import { locale, prepare_description } from "../locale/init";
import { Command } from "../typings";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'support',
    emoji: '📞',
    category: CommandCategory.Info,
    description: locale.support.description.en,
    description_localizations: prepare_description(locale.support.description),
    run: async (client, interaction, _) => {
        return await interaction.reply({
            embeds: [
                _.embeds.short(`📞 | ${_(locale.support.support_server)}`, _.colors.default)().setURL(config['s'].support_server)
            ]
        })
    }
}