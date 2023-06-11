import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import * as googleTTS from 'google-tts-api';
import * as opus from 'node-opus';
import { AudioPlayerStatus, StreamType, VoiceConnectionStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel } from '@discordjs/voice';
import { clientOptions } from './utils/intents';

const client = new Client(clientOptions);

const PREFIX = 'tt ';

client.once('ready', () => {
  console.log('Bot está online!');
});

client.on('messageCreate', async (message) => {
if (message.author.bot) return;
if (!message.content.startsWith(PREFIX)) return;

const args = message.content.slice(PREFIX.length).trim().split(/ +/);
const command = args.shift()?.toLowerCase();

if (command === 'join') {
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
    message.reply('Você precisa estar em uma chamada de voz primeiro!');
    return;
    }

    const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    message.channel.send('Entre em uma chamada de voz.');
    } catch (error) {
    console.error(error);
    message.reply('Ocorreu um erro ao entrar na chamada de voz.');
    return;
    }
} else if (command === 'repeat') {
    const text = args.join(' ');
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
    message.reply('Você precisa estar em uma chamada de voz primeiro!');
    return;
    }

    const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

    const audioPlayer = createAudioPlayer();
    const audioStream = googleTTS.getAudioUrl(text, {
        lang: 'pt-BR',
        // lang: 'en-GB',
        slow: false,
        host: 'https://translate.google.com',
    });

    const resource = createAudioResource(audioStream, {
        inputType: StreamType.Opus
        // encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    });
    audioPlayer.play(resource);

    connection.subscribe(audioPlayer);
    await entersState(audioPlayer, AudioPlayerStatus.Playing, 5_000);

    // audioPlayer.on(AudioPlayerStatus.Idle, () => {
    //     connection.destroy();
    // });
    } catch (error) {
    console.error(error);
    message.reply('Ocorreu um erro ao reproduzir a mensagem na chamada de voz.');
    return;
    }
}
});

client.login('OTYyNzI0ODQwNzU2ODgzNDc2.GJjkPE.hPWvmvlZjEjOhCzUGjVdwhRYeBPiCaTPnBmkhE');
