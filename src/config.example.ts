export default {
    // 's' = shared, 'd' = development, 'p' = production
    s: {
        devGuildID: '',
        sponsorBlock: '', // https://sponsor.ajay.app/
        soundCloud: {
            oauth: '',
            clientID: ''
        },
        omdb: '', // omdb api key
        support_server: '',
        greeter: '', // Webhook URL
        devs: [''],
        github_repo: ''
    },
    d: {
        discord: {
            clientID: '',
            token: ''
        }
    },
    p: {
        discord: {
            clientID: '', 
            token: ''
        }
    }
}

// Dev: https://discord.com/api/oauth2/authorize?client_id=1047196641318408276&permissions=8&scope=bot%20applications.commands