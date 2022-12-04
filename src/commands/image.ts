import { ActionRowBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, ButtonBuilder } from "discord.js";
import { Command } from "../typings";
import { image } from "googlethis";
import { components } from "../utils/lotsHandler";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'image',
    category: CommandCategory.Internet,
    emoji: '🖼️',
    description: locale.image.description.en,
    description_localizations: prepare_description(locale.image.description),
    options: [{
        name: 'query',
        description: locale.options.query.en,
        description_localizations: prepare_description(locale.options.query),
        type: ApplicationCommandOptionType.String,
        required: false
    }, {
        name: 'width',
        description: locale.options.width.en,
        description_localizations: prepare_description(locale.options.width),
        type: ApplicationCommandOptionType.Number,
        required: false
    }, {
        name: 'height',
        description: locale.options.height.en,
        description_localizations: prepare_description(locale.options.height),
        type: ApplicationCommandOptionType.Number,
        required: false
    }],
    run: async (client, interaction, _) => {
        const query = interaction.options.getString('query', false);
        const width = interaction.options.getNumber('width', false);
        const height = interaction.options.getNumber('height', false);

        if (query == null) {
            const { url } = (await fetch(`https://source.unsplash.com/random/${width || 900}x${height || 900}`));

            return await interaction.reply({
                embeds: [
                    _.embeds.template(_.colors.default)
                        .setTitle(`🔎 | ${_(locale.base.random_img)}`)
                        .setImage(url)
                        .setFooter({
                            text: _(locale.base.poweredBy, { service: 'Unsplash' }),
                            iconURL: 'https://unsplash.com/favicon.ico'
                        })
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            components['download'].setURL(url)
                        )
                ]
            })
        }

        let imgs = await image(query, {
            safe: true,
            additional_params: {
                hl: 'en'
            }
        });

        if (imgs == null || imgs.length === 0)
            return await interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            })

        if (width != null)
            imgs = imgs.filter(img => img?.width == width);
        
        if (height != null)
            imgs = imgs.filter(img => img?.height == height);

        const img = imgs[Math.floor(Math.random() * imgs.length)];

        const ratio = `${img?.width || width || 'auto'}x${img?.height || height || 'auto'}`;

        return await interaction.reply({
            embeds: [
                _.embeds.short(`🔎 | "${query}" (${ratio})`, _.colors.default)()
                    .setImage(img.url).setFooter({
                        text: _.cut.domain(img.url),
                        iconURL: `https://${img.origin.website.domain}/favicon.ico`
                    })
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        components['download'].setURL(img.url)
                    )
            ]
        });
    }
}