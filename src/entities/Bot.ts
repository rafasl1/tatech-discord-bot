import { AnyChannel, Client, ClientOptions, DMChannel, Message, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice"
import { join } from "path";
import { clientOptions } from "../utils/intents";
import { SongPlayer } from "./SongPlayer";

export class Bot extends Client {
    botCommandPrefix: string = "tt";
    songPlayer: SongPlayer;

    constructor() {
        const options: ClientOptions = clientOptions;
        super(options);
        this.songPlayer = new SongPlayer();
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

    async processMessage({ content, channel } : Message): Promise<void> {
        if(content.slice(0,2) === this.botCommandPrefix) {

            const contentWords = content.slice(3).split(' ');
            const command = contentWords[0];
            const subCommand = contentWords[1];
            
            try {
                switch(command) {
                    case 'repeteco':
                        this.sendMessageInChannel(`📢 ${subCommand}`, channel);
                        break;
                    case "join": 
                        this.join(channel);
                        break;
                    case "play":
                        this.sendMessageInChannel(`🔊 Tocando a música: ${subCommand}`, channel);
                        await this.handleSongCommand(subCommand);
                        break;
                    case "help":
                        this.myMessages(channel);
                        break;
                    default:
                        this.sendMessageInChannel(`Não consegui processar o seu comando 😬`, channel);
                }
            } catch(error) {
                this.sendMessageInChannel(`Tive um erro tentanto processar o seu comando 😬 ${error}`, channel);
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
    async handleSongCommand(songMessage: string) {
        await this.songPlayer.processSongMessage(songMessage);
    }

    myMessages(channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel) {
        this.sendMessageInChannel(
            `Olá! Eu sou o Tatech, o Bot do Rafa. Os meus comandos são:\n` +
            `- repeteco 📢 (vou repetir o que você falar 😁)\n` +
            `- join 🎧 (vou entrar no seu canal de voz)\n` +
            `- play ▶️ (vou tentar tocar uma música )\n` +
            `- help 🆘 (mando essa mensagem aqui!)`
        , channel);
    }
}