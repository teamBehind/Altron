import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js";

// generic support for the function

export default async <T>(vals: T[], interaction: ChatInputCommandInteraction, what: (val: T) => any, baseReply: (val: T, user: User, ratio?: string) => Promise<EmbedBuilder>, what_d?: (val: T) => any) => {
    let currentVal = 0;

    const download = what_d || what;

    if (!interaction.deferred)
        await interaction.deferReply();

    return (await interaction.editReply(
        {
            embeds: [(await baseReply(vals[currentVal], interaction.user, `(${currentVal + 1}/${vals.length})`))],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        components['previous'].setDisabled(currentVal === 0),
                        components['next'].setDisabled(currentVal === vals.length - 1),
                        components['close'],
                        components['download'].setURL(download(vals[currentVal]))
                    )
            ]
        }
    )).createMessageComponentCollector({
        filter: (i) =>
            i.user.id === interaction.user.id,
    }).on('collect', async (btnInteraction) => {
        await btnInteraction.deferUpdate();

        switch (btnInteraction.customId) {
            case 'previous':
            case 'next':
                currentVal = btnInteraction.customId === 'previous'
                    ? currentVal - 1
                    : currentVal + 1;

                return (await interaction.editReply(
                    {
                        embeds: [(await baseReply(vals[currentVal], interaction.user, `(${currentVal + 1}/${vals.length})`))],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    components['previous'].setDisabled(currentVal === 0),
                                    components['next'].setDisabled(currentVal === vals.length - 1),
                                    components['close'],
                                    components['download'].setURL(download(vals[currentVal]))
                                )
                        ]
                    }
                ))
            case 'close':
                return await interaction.deleteReply().catch(() => null);
        }
    });
}

export const components = {
    'next': new ButtonBuilder()
        .setCustomId('next')
        .setEmoji("⏭️")
        .setStyle(ButtonStyle.Primary),
    'previous': new ButtonBuilder()
        .setCustomId('previous')
        .setEmoji("⏮️")
        .setStyle(ButtonStyle.Success),
    'close': new ButtonBuilder()
        .setCustomId('close')
        .setEmoji("❌")
        .setStyle(ButtonStyle.Secondary),
    'download': new ButtonBuilder()
        .setEmoji("📥")
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com'),
} as Record<string, ButtonBuilder>