import locales from './locale';

export const locale = locales;
export const prepare_description = (locale: { en: string; ru: string; }): { ru: string } => {
    const { en, ...rest } = locale;
    return rest;
}