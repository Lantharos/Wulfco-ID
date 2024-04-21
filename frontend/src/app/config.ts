export const config = {
    api_url: "http://localhost:3000",
    stripe_key: "pk_test_51NU6p5D4hW6MEhWIoHlqqIB6qu8jj7BIb74wkXvdtYajmwFxvZWajzEM1HRJbnxXsLTwTKnSeNHi4zjrHomCMntx00LdyxmXvi",
    recaptcha_site_key: "6Lep59gnAAAAABteKrrEYF15i0UnfRGQX8gSHv38",
    hcaptcha_key: "20000000-ffff-ffff-ffff-000000000002",
    default_user_data: {
        username: "john_doe",
        password: "password-hash",
        account: {
            analytics: { personalization: true, analytics: true, zipped: true, marketing: false, tp_marketing: true },
            billing: { paypal: [], stripe: ''},
            birthday: '1241049600000',
            created: '1681735438611',
            email: "johndoe@example.com",
            email_verification: {code: 111111, verified: true},
            identity_verification: {},
            sessions: [],
            security: {
                email: false,
                protected: false,
                last_login: '1697648119258',
                security_keys: [],
                passkeys: [],
                totp: { enabled: false, secret: '' },
            },
        },
        connections: [],
        oauth: [],
        friends: { friends: [], requests: { inbound: [], outbound: [] }, blocked: []},
        profile: {
            name: ["John", "Doe"],
            gender: 'male',
            avatar: "https://play.teleporthq.io/static/svg/default-img.svg",
            about_me: 'I am a person',
            profile_color: "#ff4444",
            pronouns: "he/him"
        }
    },
    version: "3.0.0",
    production: false,
    name: "WulfCo ID"
}