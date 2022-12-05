// make a command to send a random russian meme

import { Command, MemeResult } from "../typings/";
import { CommandCategory } from "../typings/enums";
import { locale, prepare_description } from "../locale/init";

export const command: Command = {
    name: "meme",
    description: locale.meme.description.en,
    description_localizations: prepare_description(locale.meme.description),
    category: CommandCategory.Fun,
    emoji: "🎱",
    run: async (client, interaction, _) => {
        const pub = _.locale === "ru" ? "KafkaFPS" : "Memes";

        const meme: MemeResult = await getMeme(pub, pub === "KafkaFPS" ? 'мемъ' : null).catch(() => null);

        if (meme == null)
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.default)()
                ]
            });

        return interaction.reply({
            embeds: [
                _.embeds.short(`🎱 | ${_(locale.base.meme)}`, _.colors.default)(meme.title).setImage(meme.url).setFooter({
                    text: _(locale.base.poweredBy, { service: `r/${pub}` }),
                    iconURL: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png'
                })
            ]
        });
    },
};

const getMeme = async (pub: string, filtrate?: string): Promise<MemeResult> => {
    const res = await fetch(`https://www.reddit.com/r/${pub}/.json`).catch(() => null);
    const json = await res.json().catch(() => null);

    let memes = json?.data?.children;

    if (filtrate != null)
        memes = memes?.filter((m: { data: { link_flair_text: string } }) => m?.data?.link_flair_text === filtrate);

    const randomIndex = Math.floor(Math.random() * memes.length);
    const meme = memes[randomIndex]?.data;

    return meme;
};
