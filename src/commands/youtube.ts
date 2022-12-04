import { Command, } from "../typings/";
import * as yt from 'youtubei';
import { Segment, SponsorBlock } from 'sponsorblock-api';
import { ApplicationCommandOptionType } from "discord.js";
import config from "../config";
import { duration } from 'moment';
import 'moment-duration-format';
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

export const sponsorBlock = new SponsorBlock(config['s'].sponsorBlock);

export const ytClient = new yt.Client();

export const command: Command = {
    name: "youtube",
    emoji: "📺",
    category: CommandCategory.Internet,
    description: locale.youtube.description.en,
    description_localizations: prepare_description(locale.youtube.description),
    options: [
        {
            name: "query",
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],
    run: async (client, interaction, _) => {
        let query = await interaction.options.getString("query", true);

        // if it's a youtube link and it has the t parameter, remove it or else the search will fail
        if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
            const url = new URL(query);
            const t = url.searchParams.get("t");

            if (t != null)
                url.searchParams.delete("t");

            query = url.toString();
        };

        const videos = await ytClient.search(query, {
            type: 'video'
        }).catch(() => null);

        if (videos == null || videos?.items?.length === 0 || videos?.items == null)
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });


        const video = await ytClient.getVideo(videos.items[0].id).catch(() => null)!;

        if (video == null)
            return interaction.reply({
                embeds: [
                    _.embeds.short(_(locale.base.noResults), _.colors.error)()
                ]
            });

        const segments: Segment[] = await sponsorBlock.getSegments(video.id, ['sponsor', 'selfpromo']).catch(() => []);

        const subCount = video.channel.subscriberCount?.replace(' Abonnenten', '').replace(' Подписчиков', '').replace(' Subscribers', '')

        let rawDuration = duration((video as yt.Video).duration, 'seconds');

        let vDuration =
            video?.isLiveContent ? 'LIVE'
                : rawDuration
                    .format('hh:mm:ss');

        // if there are segments, remove them from the duration
        if (segments != null && Array.isArray(segments) && segments.length > 0) {
            rawDuration = rawDuration.subtract(segments?.reduce((acc, curr) => acc - (curr.startTime - curr.endTime), 0), 'seconds');
            vDuration += ` (${rawDuration.format('hh:mm:ss')})`;
        }

        return interaction.reply({
            embeds: [
                _.embeds
                    .long(
                        `"${video.title}"`,
                        _.colors.default)(
                            [{
                                name: _(locale.base.duration),
                                value: (
                                    vDuration
                                ),
                                inline: true,
                            }, {
                                name: _(locale.base.likes),
                                value: video.likeCount?.toLocaleString() || "?",
                                inline: true,
                            }, {
                                name: _(locale.base.integrated_ads) + "?",
                                value: (segments != null && segments.length > 0) ? `${_(locale.base.yes)} (${segments.length})` : _(locale.base.no),
                                inline: true
                            }, {
                                name: _(locale.base.views),
                                value: (video.viewCount || 0)!.toLocaleString(),
                                inline: true,
                            }, {
                                name: _(locale.base.publishedAt),
                                value: video.uploadDate,
                                inline: true,
                            }, {
                                name: _(locale.base.author),
                                value: video.channel.name,
                                inline: true,
                            }, {
                                name: _(locale.base.description),
                                value: `\`\`${_.cut.description(video.description, 275)}\`\``
                            }])
                    .setFooter({
                        iconURL: video.channel.thumbnails?.best!,
                        text: `${video.channel.name} | ${subCount} Subscribers\nUsing https://sponsor.ajay.app/ and YouTube`,
                    })
                    .setImage(video.thumbnails.best!).setURL(`https://youtube.com/watch?v=${video.id}`)
                    .setThumbnail(video.channel.thumbnails?.best!)
            ]
        })
    }
}