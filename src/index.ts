import { getChannelsFromServerByChannelCache, messageIsFromBotOrIsDM } from "./utils/utils"
import { Bot } from "./entities/Bot";
import 'dotenv/config'

const tatech = new Bot();

tatech.on("ready", () => {
    console.log(`Bot foi inicializado com sucesso!`);
    console.log(`Users do server: ${JSON.stringify(tatech.users.cache.at(0).username)}`);
    console.log(`Canais do server: ${getChannelsFromServerByChannelCache(tatech.channels.cache)}`);

    tatech.user.setStatus("online");
    tatech.user.setActivity("Elden Ring");
})

tatech.on("messageCreate", async message => {
    if(messageIsFromBotOrIsDM(message)) return;
    await tatech.processMessage(message);
})

tatech.login(process.env.DISCORD_BOT_TOKEN);