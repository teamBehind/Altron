import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Interaction, InteractionType } from "discord.js";
import { Event } from "../typings";
import _inCommand from "../utils/_inCommand";
import { searchVideo, Video } from 'usetube';
import { AutocompleteResult } from "duck-duck-scrape";
import { SoundcloudTrackV2 } from "soundcloud.ts";
import { soundcloud } from "../commands/song";
import wiki, { wikiSearchResult } from 'wikipedia';
import * as malScraper from 'mal-scraper';

export const event: Event = {
    name: 'interactionCreate',
    run: async (client, interaction: Interaction) => {
        await _inCommand.setLocale(interaction.guildLocale);

        _inCommand.locale = _inCommand.getLocale(interaction.guildLocale);

        if (interaction.isChatInputCommand()) {
            const command = await client.commands.get(interaction.commandName);

            if (command == null)
                return;

            try {
                await command.run(client, interaction, _inCommand);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else {
            switch (interaction.type) {
                case InteractionType.ApplicationCommandAutocomplete:
                    const command = await client.commands.get(interaction.commandName);
                    const focusedOption = await interaction.options.getFocused(true);

                    switch (command.name) {
                        case "youtube":
                            AutoComplete<Video>(
                                interaction,
                                async () => (await searchVideo(focusedOption.value))?.videos,
                                (from) => {
                                    return {
                                        name: from.title,
                                        value: from.id
                                    }
                                }
                            )
                            break;
                        case "song":
                            AutoComplete<SoundcloudTrackV2>(
                                interaction,
                                async () => await soundcloud.tracks.searchAlt(focusedOption.value),
                                (from) => {
                                    return {
                                        name: from.title,
                                        value: from.permalink
                                    }
                                }
                            )
                            break;
                        case "wiki":
                            await wiki.setLang(_inCommand.getLocale(interaction.guildLocale));

                            AutoComplete<wikiSearchResult | any>(
                                interaction,
                                async () => (await wiki.search(focusedOption.value).catch(() => null))?.results,
                                (from) => {
                                    return {
                                        name: from?.title,
                                        value: from?.title
                                    }
                                }
                            )
                            break;
                        case "anime":
                            AutoComplete<malScraper.SearchResultsDataModel>(
                                interaction,
                                async () => await malScraper.getResultsFromSearch(focusedOption.value).catch(() => null),
                                (from) => {
                                    return {
                                        name: from.name,
                                        value: from.name
                                    }
                                },
                                (filtrate) => {
                                    return filtrate.type === 'anime'
                                }
                            )
                            break;
                        case "help":
                            AutoComplete(
                                interaction,
                                async () => await client.commands.map((command) => command.name),
                                (from) => {
                                    return {
                                        name: from,
                                        value: from
                                    }
                                },
                                (filtrate) => {
                                    return filtrate.includes(focusedOption.value)
                                }
                            )
                            break;
                    }
            }
        }
    }
}

export const AutoComplete = async <T>(interaction: AutocompleteInteraction, get_: () => Promise<T[]>, retrieve_: (from: T) => ApplicationCommandOptionChoiceData, filter_?: (filtrate: T) => boolean) => {
    let result = await get_();

    if (result == null || result.length == 0 || !Array.isArray(result))
        return;

    if (filter_ != null)
        result = result.filter(filter_);

    result = result.splice(0, 5);

    await interaction.respond(
        result.map(retrieve_)
    ).catch(() => null);
}