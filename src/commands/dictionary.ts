import { Command } from "../typings";
import { ApplicationCommandOptionType, User } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";
import lotsHandler from "../utils/lotsHandler";
import _inCommand from "../utils/_inCommand";

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

        const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`).catch(() => null);
        const data: Data = await res?.json().catch(() => null);

        if (data == null || data?.list?.length == 0 || !Array.isArray(data?.list))
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });

        if (data?.list.length === 1)
            return interaction.reply({
                embeds: [(await replier(data[0], interaction.user))],
            });

        return lotsHandler<DataList>(
            data?.list,
            interaction,
            (def) => def.definition,
            replier,
            (def) => def.permalink
        );
    }
}

export const replier = async (val: DataList, user: User, ratio?: string) => {
    return _inCommand.embeds.short(`🔎 | "${val.word}" ${ratio || ''}`, _inCommand.colors.default)(`\`\`${val.definition.replaceAll('[', '').replaceAll(']', '')}\`\``).setFooter({
        text: _inCommand(locale.base.poweredBy, { service: 'Urban Dictionary' }),
        iconURL: 'https://avatars.githubusercontent.com/u/80348?s=280&v=4'
    })
}

interface Data {
    list: DataList[]
}

interface DataList {
    definition: string;
    permalink: string;
    thumbs_up: number;
    author: string;
    word: string;
    defid: number;
    current_vote: string;
    written_on: string;
    example: string;
    thumbs_down: number
}