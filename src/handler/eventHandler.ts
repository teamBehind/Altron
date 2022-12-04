import { Client } from "discord.js";
import { readdirSync } from 'fs';
import { Event } from "../typings";

export const runEventHandler = async (client: Client) => {
    const events: string[] = readdirSync(`${process.cwd()}/dist/events`);

    events.forEach((eventName) => {
        const { event } = require(`../events/${eventName}`) as { event: Event };

        client.on(event.name, event.run.bind(null, client));
    })
}