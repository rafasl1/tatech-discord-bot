import { Collection, Channel, AnyChannel } from "discord.js";

export const getChannelsFromServerByChannelCache = (channelCache/*: Collection<string, AnyChannel>*/) => {
    return channelCache
        .filter(channel => {
            return channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE"
        })
        .map(channel => {
            return channel.name
        })
        .join(", ");
}

export const messageIsFromBotOrIsDM = (message): boolean => {
    return (
        message.author.bot ||
        message.channel.type === "DM"
    )
}