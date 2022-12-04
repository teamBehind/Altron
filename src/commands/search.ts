import { Command } from "../typings/";
import { search } from "googlethis";
import { search as ddSearch, SafeSearchType } from "duck-duck-scrape";
import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: "search",
    emoji: "🔍",
    category: CommandCategory.Internet,
    description: locale.search.description.en,
    description_localizations: prepare_description(locale.search.description),
    options: [
        {
            name: "query",
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "engine",
            description: locale.options.search_engine.en,
            description_localizations: prepare_description(locale.options.search_engine),
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "Google",
                    value: "google",
                },
                {
                    name: "DuckDuckGo",
                    value: "duckduckgo",
                },
            ],
            required: false
        }
    ],
    run: async (client, interaction, _) => {
        const query = await interaction.options.getString("query", true);

        let results: { url: string; title: string; icon: string; domain: string }[] = [];

        const engine: string | "duckduckgo" | "google" = await interaction.options.getString("engine", false) || "google";

        const result = engine === "duckduckgo" ? await ddSearch(query, {
            safeSearch: SafeSearchType.MODERATE,
            locale: _.getLocale(interaction.guildLocale),
        })
            : await search(query, {
                safe: true,
                additional_params: {
                    hl: _.getLocale(interaction.guildLocale),
                },
            });

        result.results.forEach((r) => {
            results.push({
                url: r.url,
                title: r.title,
                icon: r?.favicons?.high_res || r?.favicons?.low_res || r.icon,
                domain: _.cut.domain(r.url),
            });
        });

        // leave only 5 results (if there are more than 5)
        results = results.slice(0, 5);

        if (results.length === 0)
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });

        return interaction.reply({
            embeds: [
                _.embeds.long(null, _.colors.default)(
                    results.map((r) => ({
                            name: r.title,
                            value: `[${r.domain}](${r.url})`,
                            inline: false,
                        })
                    )).setFooter({
                        text: _(locale.base.poweredBy, { service: engine === "duckduckgo" ? "DuckDuckGo" : "Google" }),
                        iconURL: engine === "duckduckgo"
                            ? "https://duckduckgo.com/favicon.ico"
                            : "https://www.google.com/favicon.ico",
                    }).setThumbnail(
                        results[0].icon
                    ),
            ]
        });
    },
};