import { ApplicationCommandOptionType, User } from "discord.js";
import { Command } from "../typings";
import emojigg, { EmojiResult } from 'emojigg';
import _inCommand from "../utils/_inCommand";
import lotsHandler from "../utils/lotsHandler";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'emoji',
    emoji: '☺️',
    category: CommandCategory.Internet,
    description: locale.emoji.description.en,
    description_localizations: prepare_description(locale.emoji.description),
    options: [{
        name: 'query',
        description: locale.options.query.en,
        description_localizations: prepare_description(locale.options.query),
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async (client, interaction, _) => {
        const query = interaction.options.getString('query', true);
        const emojis = await emojigg.get(query) as EmojiResult[];

        if (emojis.length === 0)
            return await interaction.reply({
                embeds: [
                    _inCommand.embeds.short(_(locale.base.noResults), _inCommand.colors.error)()
                ]
            })
        else if (emojis.length === 1)
            return await interaction.reply({
                embeds: [(await replier(emojis[0], interaction.user))]
            });
        else {
            return await lotsHandler<EmojiResult>(emojis, interaction, (emoji) => {
                return emoji.image;
            }, replier);
        }
    }
}

const replier = async (emoji: EmojiResult, user: User, ratio?: string) => {
    return _inCommand.embeds.long(`🔎 | "${emoji.title}" ${ratio || ''}`, _inCommand.colors.default)([
        {
            name: _inCommand(locale.base.likes),
            value: emoji.faves.toLocaleString(),
            inline: true
        },
        {
            name: _inCommand(locale.base.slug),
            value: emoji.slug,
            inline: true
        }, {
            name: _inCommand(locale.base.submittedBy),
            value: `${emoji.submitted_by}`,
            inline: true
        }]).setThumbnail(emoji.image)
        .setFooter({
            text: _inCommand(locale.base.poweredBy, { service: 'emoji.gg' }),
            iconURL: 'https://emoji.gg/assets/img/img.png'
        })
}