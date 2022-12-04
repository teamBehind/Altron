import { ActivityType } from "discord.js";
import { fetchCommands, uploadCommands } from "../handler/commandHandler";
import { Event } from "../typings";
import { UploadType } from "../typings/enums";
import { isDev } from "../utils/production";

export const event: Event = {
    name: 'ready',
    run: async (client) => {
        client.user?.setPresence({
            activities: [
                {
                    name: 'the Internet',
                    type: ActivityType.Watching
                }
            ]
        });

        const fetchedCommands = await fetchCommands();

        fetchedCommands.forEach((command) => {
            client.commands.set(command.name, command);
        });

        await uploadCommands(fetchedCommands, isDev ? UploadType.guild : UploadType.global);
    }
}