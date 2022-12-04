import { Colors, Locale } from 'discord.js';
import { long, short, template } from './embed';
const translatte = require('translatte');

let this_loc: "en" | "ru" = "en";

// _('hey %.idk %.anything', { idk: 'hi', anything: 'bye' })
// => 'hey hi bye'
const _inCommand = (value: { en: string; ru: string; }, dynamicValue?: Record<string, any>) => {
    let result = value[this_loc];

    if (result.includes('%.') && dynamicValue != null)
        for (const [key, value] of Object.entries(dynamicValue))
            result = result.replaceAll(`%.${key}`, value);

    return result;
}

_inCommand.translate = async (value: string, to = 'ru') => {
    const translated = await translatte(value, { from: 'en', to }).catch(() => null);

    return translated?.text || value;
}

_inCommand.getLocale = (guildLocale?: Locale): 'en' | 'ru' => {
    if (guildLocale == null)
        return this_loc = 'en';
    else if (guildLocale === 'ru')
        return this_loc = 'ru';
    else
        return this_loc = 'en';
}

_inCommand.setLocale = (guildLocale?: Locale) => {
    let locale = _inCommand.getLocale(guildLocale);

    return this_loc = locale;
}

_inCommand.locale = "en";
_inCommand.embeds = { long, short, template };
_inCommand._colors = Colors;
_inCommand.array = {
    chunk: (val: any[]) => (val.length === 1 && val[0] === '') ||
        !Array.isArray(val) || val.length === 0
}
_inCommand.cut = {
    /*
        @  _.cut.domain converts
        @    a url like: https://subdomain.example.com/?param=example
        @    to something like: subdomain.example.com
    */
    domain: (value: string): string => {
        return value.replace(/https?:\/\//, "").split("/")[0]
    },
    description: (text: string, len: number) => {
        let hasCut = false;

        if (text.length > len) {
            const cut = text.lastIndexOf(" ", len);
            if (cut === -1) return text.substring(0, len);

            hasCut = true;
            text = text.substring(0, cut);
        }

        return hasCut ? `${text}...` : text;
    }
}
_inCommand.colors = {
    error: Colors.Red,
    default: Colors.Green,
    info: Colors.DarkOrange,
}

export default _inCommand