import { ClientOptions } from "discord.js";

export const clientOptions: ClientOptions = {
    intents: [
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_MESSAGE_TYPING",
        "GUILD_SCHEDULED_EVENTS",
        "GUILDS",
        "DIRECT_MESSAGES",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS"
    ]
}