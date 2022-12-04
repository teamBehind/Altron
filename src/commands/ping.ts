import { locale, prepare_description } from "../locale/init";
import { Command } from "../typings";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'ping',
    emoji: '🏓',
    category: CommandCategory.Info,
    description: locale.ping.description.en,
    description_localizations: prepare_description(locale.ping.description),
    run: async (client, interaction, _) => {
        const _start = Date.now();
        
        await interaction.deferReply();

        const _end = Date.now();
        const ping = _end - _start;

        return await interaction.editReply({
            embeds: [
                _.embeds.short(`🏓 | ${ping}ms`, _.colors.default)()
            ]
        })
    }
}