import { AnyChannel, Client, ClientOptions, DMChannel, Message, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice"
import { join } from "path";
import { clientOptions } from "../utils/intents";

export class Bot extends Client {
    botCommandPrefix: string = "tt";

    constructor() {
        const options: ClientOptions = clientOptions;
        super(options);
    }

    getSpecificChannelById(channelId: string): AnyChannel {
        return this.channels.cache.get(channelId);
    }
    
    sendMessageInChannel(
        message: string, 
        channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel
    ):void {
        channel.send(message);
    }

    processMessage({ content, channel } : Message): void {
        if(content.slice(0,2) === this.botCommandPrefix) {
            const command = content.slice(3);
            this.sendMessageInChannel(`O seu comando foi: ${command}?`, channel);
            
            try {
                this[`${command}`](channel);
            } catch(error) {
                this.sendMessageInChannel(`Não consegui processar o seu comando: ${command}?`, channel);
            }
        }
    }

    join(channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel) {
        const channelToJoin = this.getSpecificChannelById(process.env.VOICE_CHANNEL_ID);

        if(channelToJoin) {
            this.sendMessageInChannel(
                `Entrando no canal ${channelToJoin.toString()}!`, 
                channel
            );

            const tatonesDeveloperPortal = this.guilds.cache.get(process.env.DISCORD_SERVER_ID);

            try {
                const voiceConnection = joinVoiceChannel({
                    channelId: channelToJoin.id,
                    guildId: tatonesDeveloperPortal.id,
                    adapterCreator: tatonesDeveloperPortal.voiceAdapterCreator,
                });

                const voicePlayer = createAudioPlayer();
                const songtoPlay = createAudioResource(join(__dirname, 'song.mp3'))

                voicePlayer.play(songtoPlay);
                voiceConnection.subscribe(voicePlayer);
            } catch(error) {
                channel.send(`Erro ao entrar no canal ou ao reproduzir som. ${error}?`)
            }
        } else {
            this.sendMessageInChannel(`Não consegui entrar no seu canal :/`, channel)
        }
    }
}