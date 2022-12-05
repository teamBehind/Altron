// a command to get information about a song from soundcloud
import { Command } from "../typings";
import Soundcloud, { SoundcloudTrackV2 } from "soundcloud.ts";
import config from '../config';
import _inCommand from "../utils/_inCommand";
import lotsHandler from "../utils/lotsHandler";
import { duration } from "moment";
import { locale, prepare_description } from "../locale/init";
import { CommandCategory } from "../typings/enums";

const config_soundcloud = config['s'].soundCloud;
export const soundcloud = new Soundcloud(config_soundcloud.clientID, config_soundcloud.oauth);

export const command: Command = {
    name: "song",
    emoji: "🎵",
    category: CommandCategory.Internet,
    description: locale.song.description.en,
    description_localizations: prepare_description(locale.song.description),
    options: [
        {
            name: "query",
            description: locale.options.query.en,
            description_localizations: prepare_description(locale.options.query),
            type: 3,
            required: true,
            autocomplete: true
        },
    ],
    run: async (client, interaction, _) => {
        await interaction.deferReply();

        const query = await interaction.options.getString("query", true);

        const songs = await soundcloud.tracks.searchAlt(query).catch(() => null);

        if (songs == null || !Array.isArray(songs) || songs.length === 0)
            return await interaction.editReply({
                embeds: [
                    _.embeds
                        .short(_(locale.base.noResults), _.colors.error)()
                ],
            });
        if (songs.length === 1)
            return await interaction.editReply({
                embeds: [(await replier(songs[0], interaction.user))],
            });

        return lotsHandler<SoundcloudTrackV2>(
            songs,
            interaction,
            (song) => song.artwork_url,
            replier,
            (song) => song.permalink_url
        );
    }
}

const replier = async (song: SoundcloudTrackV2, user, ratio?) => {
    return _inCommand.embeds
        .long(`🔎 | "${song.title}" ${ratio || ''}`, _inCommand.colors.default)([
            {
                name: _inCommand(locale.base.publishedAt),
                value: new Date(song.created_at).toLocaleString(),
                inline: true,
            },
            {
                name: _inCommand(locale.base.author),
                value: song.user.username,
                inline: true,
            },
            {
                name: _inCommand(locale.base.duration),
                value: duration(song.duration).format("hh:mm:ss"),
                inline: true,
            },
        ])
        .setThumbnail(song?.artwork_url)
        .setFooter({
            text: _inCommand(locale.base.poweredBy, { service: "SoundCloud" }),
            iconURL: "https://a-v2.sndcdn.com/assets/images/sc-icons/win8-2dc974a18a.png",
        });
}