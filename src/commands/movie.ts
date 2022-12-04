import { Command } from "../typings";
import * as movier from '@svperuser/omdb-api-wrapper';
import config from "../config";
import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

const omdb = movier.createClient(config['s'].omdb);

export const command: Command = {
    name: 'movie',
    emoji: '🎥',
    category: CommandCategory.Internet,
    description: locale.movie.description.en,
    description_localizations: prepare_description(locale.movie.description),
    options: [
        {
            name: 'query',
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction, _) => {
        const query = interaction.options.getString('query', true);

        // --- This is VERY important, so a http parameter pollution attack can't be done ---
        const safeQuery = encodeURIComponent(query);

        const movie: {
            Title: string;
            Year: string;
            Rated: string;
            Released: string;
            Runtime: string;
            Genre: string;
            Director: string;
            Writer: string;
            Actors: string;
            Plot: string;
            Language: string;
            Country: string;
            Awards: string;
            Poster: string;
            Ratings: {
                Source: string;
                Value: string;
            }[];
            Metascore: string;
            BoxOffice: string;
            Error?: string;
            Response: 'True' | 'False';
        } = await omdb.findOneByTitle(safeQuery).catch(() => null);

        if (movie == null || movie?.Error === "Movie not found!")
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });

        console.log(movie)
        console.log(query)
        console.log(safeQuery)

        return interaction.reply({
            embeds: [
                _.embeds.long(`🔎 | "${movie.Title}"`, _.colors.default)([
                    {
                        name: _(locale.base.directors),
                        value: movie.Director || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.actors),
                        value: movie.Actors || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.genres),
                        value: movie.Genre || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.publishedAt),
                        value: movie.Released || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.duration),
                        value: movie.Runtime || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.country),
                        value: movie.Country || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.language),
                        value: movie?.Language || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.awards),
                        value: movie?.Awards || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.rating),
                        value: _.array.chunk(movie.Ratings) ? 'n/A'
                                : movie?.Ratings?.map((r) => `${r.Source}: ${r.Value}`).join('\n'),
                        inline: true
                    },
                    {
                        name: _(locale.base.rated),
                        value: movie?.Rated || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.metascore),
                        value: movie?.Metascore || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.boxOffice),
                        value: movie?.BoxOffice || 'N/A',
                        inline: true
                    },
                    {
                        name: _(locale.base.description),
                        value: movie?.Plot || 'N/A',
                        inline: false
                    },
                    /// get the first letters of each word in the title, join them and make them uppercase
                ]).setThumbnail(movie.Poster !== 'N/A' ? movie.Poster : `https://ui-avatars.com/api/?name=${movie.Title.split(' ').map((w) => w[0]).join('').toUpperCase()}&background=000000&color=ffffff&size=256`).setFooter({
                    text: _(locale.base.poweredBy, {
                        service: 'OMDb'
                    }),
                    iconURL: 'https://www.omdb.org/images/layout/omdb-touch-icon.png'
                })
            ]
        });

    }
}
