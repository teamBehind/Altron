import { APIEmbedField, ColorResolvable, EmbedBuilder } from "discord.js";

export const long = (title: string | null, color: ColorResolvable) => {
    const embed = new EmbedBuilder().setColor(color);

    if (title != null)
        embed.setTitle(title);
        
    return (fields: APIEmbedField[]) => {
        embed.addFields(fields);

        return embed;
    }
}

export const short = (title: string, color: ColorResolvable) => {
    const embed = new EmbedBuilder().setTitle(title).setColor(color);

    return (description?: string) => {
        if (description != null)
            embed.setDescription(description);

        return embed;
    }
}

export const template = (color: ColorResolvable) => {
    return new EmbedBuilder().setColor(color);
}