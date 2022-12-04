import { ApplicationCommandOptionType } from "discord.js";
import { locale, prepare_description } from "../locale/init";
import { Animal, Command } from "../typings";
import { CommandCategory } from "../typings/enums";

export const command: Command = {
    name: 'animal',
    description: locale.animal.description.en,
    description_localizations: prepare_description(locale.animal.description),
    category: CommandCategory.Fun,
    emoji: '🐶',
    options: [{
        name: 'animal',
        description: locale.options.animal.en,
        description_localizations: prepare_description(locale.options.animal),
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: Object.values(locale.animal.pets).map(n => {
            return {
                name: n.en,
                value: n.en.toLowerCase().replace(' ', '_')
            }
        })
    }],
    run: async (client, interaction, _) => {
        await interaction.deferReply();

        const animal: string | Animal = interaction.options.getString('animal') ?? animals[Math.floor(Math.random() * animals.length)];

        const res = await fetch(`https://some-random-api.ml/animal/${animal}`);
        const data = await res.json();

        if (_.locale !== 'en') {
            data.fact = await _.translate(data.fact);
        };

        return interaction.editReply({
            embeds: [
                _.embeds.short(`🐾 | ${_(locale.animal.pets[animal])}`, _.colors.default)(data.fact).setThumbnail(data.image).setFooter({
                    text: _(locale.base.poweredBy, { service: 'Some Random API' }),
                    iconURL: 'https://i.some-random-api.ml/logo.png'
                })
            ]
        });
    }
};

const animals: Animal[] = ['dog', 'cat', 'panda', 'red_panda', 'bird', 'koala'];