import { Command } from "../typings";
import { CommandCategory } from "../typings/enums";
import compile from "./compiler";

export default {
    'anime': {
        description: compile(
            'Search for an anime on MyAnimeList',
            'Поиск аниме на MyAnimeList'
        ),
    },
    'youtube': {
        description: compile(
            'Search videos on YouTube',
            'Поиск видео на YouTube',
        )
    },
    'about': {
        description: compile(
            'Information about the bot',
            'Информация о боте'
        ),
        about: compile(
            'About',
            'О боте'
        ),
    },
    'meme': {
        description: compile(
            'Search memes on Reddit',
            'Поиск мемов на Reddit',
        )
    },
    'animal': {
        description: compile(
            'Picture and fact about an animal',
            'Картинка и факт про животное'
        ),
        pets: {
            dog: compile(
                'Dog',
                'Собака'
            ),
            cat: compile(
                'Cat',
                'Кот/Кошка'
            ),
            panda: compile(
                'Panda',
                'Панда'
            ),
            red_panda: compile(
                'Red Panda',
                'Красная панда'
            ),
            bird: compile(
                'Bird',
                'Птица'
            ),
            koala: compile(
                'Koala',
                'Коала'
            )
        }
    },
    'ping': {
        description: compile(
            'Pong!',
            'Понг!'
        )
    },
    'emoji': {
        description: compile(
            'Search for an emoji in the internet',
            'Поиск эмодзи в интернете',
        )
    },
    'dictionary': {
        description: compile(
            'Search for a word in the urban dictionary',
            'Поиск слова в словаре (только английский)',
        )
    },
    'image': {
        description: compile(
            'Search images on Google',
            'Поиск изображений на Google',
        )
    },
    'search': {
        description: compile(
            'Search any infromation in the internet',
            'Поиск информации в интернете',
        )
    },
    'movie': {
        description: compile(
            'Search for a movie on OMDB',
            'Поиск фильма на OMDB',
        )
    },
    'wiki': {
        description: 
            compile(
                'Searches for a page on the wiki',
                'Ищет страницу на вики'
            ),
    },
    'song': {
        description: compile(
            'Поиск песни на SoundCloud',
            'Search song on SoundCloud'
        )
    },
    'support': {
        description: compile(
            'Link to the support server',
            'Ссылка на сервер поддержки'
        ),
        support_server: compile(
            'Support server',
            'Сервер поддержки'
        )
    },
    'help': {
        description: compile(
            'Shows help menu',
            'Показывает меню помощи'
        ),
        help_menu: compile(
            'Help Пenu',
            'Меню Помощи'
        ),
    },
    'options': {
        animal: compile(
            'Тип животного',
            'Animal type'
        ),
        query: compile(
            'The query to search for',
            'Запрос для поиска'
        ),
        search_engine: compile(
            'The search engine to use for the search',
            'Поисковая система для поиска информации'
        ),
        width: compile(
            'Width of the image',
            'Ширина изображения'
        ),
        height: compile(
            'Height of the image',
            'Высота изображения'
        ),
        command_name: compile(
            'The name of the command',
            'Название команды'
        ),
    },
    'categories': {
        [CommandCategory.Fun]: compile(
            'Fun',
            'Развлечения'
        ),
        [CommandCategory.Internet]: compile(
            'Internet',
            'Интернет'
        ),
        [CommandCategory.Info]: compile(
            'Information',
            'Информация'
        ),
    } as Record<CommandCategory, { en: string; ru: string; }>, 
    'base': {
        random_img: compile(
            'Random Image',
            'Случайное изображение'
        ),
        noResults: compile(
            '🔎 | No Results',
            '🔎 | Ничего не найдено'
        ),
        poweredBy: compile(
            'Powered by %.service',
            'Сделано с помощью %.service'
        ),
        duration: compile(
            'Duration',
            'Продолжительность'
        ),
        episodes: compile(
            'Episodes',
            'Эпизоды'
        ),
        chapters: compile(
            'Chapters',
            'Главы'
        ),
        publishedAt: compile(
            'Published At',
            'Опубликовано'
        ),
        genres: compile(
            'Genre/s',
            'Жанр/ы'
        ),
        directors: compile(
            'Director/s',
            'Режиссер/ы'
        ),
        actors: compile(
            'Actor/s',
            'Актёр/ы'
        ),
        country: compile(
            'Country',
            'Страна'
        ),
        language: compile(
            'Language',
            'Язык'
        ),
        awards: compile(
            'Awards',
            'Награды'
        ),
        characters: compile(
            'Character/s',
            'Персонаж/и'
        ),
        synonyms: compile(
            'Synonym/s',
            'Синоним/ы'
        ),
        studios: compile(
            'Studio/s',
            'Студиии'
        ),
        score: compile(
            'Score',
            'Оценка'
        ),
        rating: compile(
            'Rating/s',
            'Рейтинг/и'
        ),
        rated: compile(
            'Rated',
            'Сертификация'
        ),
        meme: compile(
            'Meme',
            'Мем'
        ),
        metascore: compile(
            'Metascore',
            'Метарейтинг'
        ),
        popularity: compile(
            'Popularity',
            'Популярность'
        ),
        main_characters: compile(
            'Main',
            'Основных'
        ),
        boxOffice: compile(
            'Box Office',
            'Кассовые сборы'
        ),
        type: compile(
            'Type',
            'Тип'
        ),
        status: compile(
            'Status',
            'Статус'
        ),
        integrated_ads: compile(
            'Integrated ads',
            'Встроенные рекламы'
        ),  
        likes: compile(
            'Likes',
            'Лайки'
        ),
        views: compile(
            'Views',
            'Просмотры'
        ),
        author: compile(
            'Author',
            'Автор'
        ),
        dislikes: compile(
            'Dislikes',
            'Дизлайки'
        ),
        description: compile(
            'Description',
            'Описание'
        ),
        yes: compile(
            'Yes',
            'Да'
        ),
        no: compile(
            'No',
            'Нет'
        ),
        submittedBy: compile(
            'Submitted by',
            'Отправлено'
        ),
        slug: compile(
            'Slug',
            'Использованее'
        ),
        category: compile(
            'Category',
            'Категория'
        ),
        options: compile(
            'Options',
            'Опции'
        ),
        none: compile(
            'None',
            'Нет'
        ),
        developer: compile(
            'Developer',
            'Разработчик'
        ),
        writtenIn: compile(
            'Written in',
            'Написано на'
        ),
        version: compile(
            'Version',
            'Версия'
        ),
        sourceCode: compile(
            'Source Code',
            'Исходный код'
        ),
        clickHere: compile(
            'Tap-Tap',
            'Тык-Тык'
        ),
        users: compile(
            'Users',
            'Пользователи'
        ),
        guilds: compile(
            'Guilds',
            'Серверы'
        ),
    }
}