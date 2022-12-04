import { Command } from "../typings/";
import wiki from "wikipedia";
import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: "wiki",
    emoji: "📖",
    category: CommandCategory.Internet,
    description: locale.wiki.description.en,
    description_localizations: prepare_description(locale.wiki.description),
    options: [
        {
            name: "query",
            description: locale.wiki.description.en,
            description_localizations: prepare_description(locale.wiki.description),
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        }
    ],
    run: async (client, interaction, _) => {
        const query = interaction.options.getString("query", true);

        await wiki.setLang(_.getLocale(interaction.guildLocale));

        const wikipedia = await wiki.page(query).catch(() => null);

        if (wikipedia == null)
            return await interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });

        const summary = await wikipedia.summary();

        return interaction.reply({
            embeds: [
                _.embeds
                    .short(
                        `🔎 | "${wikipedia?.title || query}"`,
                        _.colors.default
                    )
                    (summary.description || summary.extract || "?")
                    .setURL(summary.content_urls.desktop.page)
                    .setThumbnail(summary.originalimage?.source)
                    .setFooter({
                        text: _(locale.base.poweredBy, { service: 'Wikipedia' }),
                        iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png"
                    }),
            ],
        });
    }
};