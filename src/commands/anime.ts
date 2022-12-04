import { Command } from "../typings";
import * as malScraper from 'mal-scraper';
import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'anime',
    description: locale.anime.description.en,
    description_localizations: prepare_description(locale.anime.description),
    category: CommandCategory.Internet,
    emoji: '🌸',
    options: [
        {
            name: 'query',
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction, _) => {
        const query = interaction.options.getString('query', true);
        const anime: malScraper.AnimeDataModel = await malScraper.getInfoFromName(query, true).catch(() => null);

        if (anime == null)
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.description), _.colors.error)()
                ]
            });

        return interaction.reply({
            embeds: [
                _.embeds.long(`🔎 | "${anime.title}"`, _.colors.default)([
                {
                    name: _(locale.base.studios),
                    value: anime.studios?.join(', ') || '?',
                    inline: true
                }, 
                { 
                    name: _(locale.base.synonyms),
                    value: (
                        _.array.chunk(anime.synonyms)
                                ? 'None'
                                : anime.synonyms.join(', ')
                    ),
                    inline: true
                }, {
                    name: _(locale.base.characters),
                    value: `${anime?.characters?.length} (${anime?.characters?.filter(u => u.role == 'Main').length} ${_(locale.base.main_characters)})`,
                    inline: true
                }, {
                    name: _(locale.base.genres),
                    value: anime?.genres?.join(', ') || 'None',
                    inline: true
                }, {
                    name: _(locale.base.publishedAt),
                    value: anime?.aired || '?',
                    inline: true
                }, {
                    name: _(locale.base.episodes),
                    value: `${anime?.episodes || '?'} ${anime?.chapters != null ? anime?.chapters : ''}`,
                    inline: true
                }, {
                    name: _(locale.base.duration),
                    value: anime?.duration || '?',
                    inline: true
                }, {
                    name: _(locale.base.rating),
                    value: anime?.rating || '?',
                    inline: true
                }, {
                    name: _(locale.base.score),
                    value: anime?.score || '?',
                    inline: true
                }, {
                    name: _(locale.base.popularity),
                    value: anime?.popularity || '?',
                    inline: true
                }, {
                    name: _(locale.base.rating),
                    value: anime?.ranked || '?',
                    inline: true
                }, {
                    name: _(locale.base.description),
                    value: `\`\`${_.cut.description(anime?.synopsis, 350)}\`\`` || '?',
                    inline: false
                }]).setThumbnail(anime?.picture).setFooter({
                    text: _(locale.base.poweredBy, { service: 'MyAnimeList' }),
                    iconURL: 'https://pbs.twimg.com/profile_images/1190380284295950339/Py6XnxvH_400x400.jpg'
                }).setURL(anime.url)
            ]
        });
    }
}