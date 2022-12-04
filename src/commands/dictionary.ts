import { Command } from "../typings";
import urban from 'urban-eng-dictionary';
import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'dictionary',
    description: locale.dictionary.description.en,
    description_localizations: prepare_description(locale.dictionary.description),
    emoji: '📖',
    category: CommandCategory.Internet,
    options: [
        {
            name: 'query',
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: false
        }
    ],
    run: async (client, interaction, _) => {
        const query = await interaction.options.getString('query', true);
        const dictionary: string | "urban" | "merriam" | "oxford" = 'urban';

        switch (dictionary) {
            case 'urban':
                const urbanResult: string[] = await urban(query).catch(() => null);

                if (urbanResult == null)
                    return interaction.reply({
                        embeds: [
                            _.embeds.short(_(locale.base.noResults), _.colors.error)()
                        ]
                    });

                return interaction.reply({
                    embeds: [
                        _.embeds.short(`🔎 | "${query}"`, _.colors.default)(`\`\`${urbanResult[Math.floor(Math.random()*urbanResult.length)]}\`\``).setFooter({
                            text: _(locale.base.poweredBy, { service: 'Urban Dictionary' }),
                            iconURL: 'https://avatars.githubusercontent.com/u/80348?s=280&v=4'
                        })
                    ]
                });
        }
    }
}