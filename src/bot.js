// Garbot2 or just Garbot bc Garbot1 is abandoned lol
// developed by Garhu5 AKA garhu AKA Rhuel

const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

require("dotenv").config();
client.login(process.env.GARBOT_DISCORD_BOT_TOKEN);

// functions/commands
const fx = {
    osu: require("./Functions/banchoapi"),
    econ: require("./Functions/econ"),
    gen: require("./Functions/gen")
}
const cmds = {
    general: require("./Commands/general"),
    osu: require("./Commands/osu"),
    fun: require("./Commands/fun"),
    dev: require("./Commands/dev"),
    econ: require("./Commands/economy")
}

let prefix = ">>";

// =============== events ===============
client.on("ready", async () => {
    console.log(`Waking ${client.user.tag}...`);
    console.log("Bot ready!");
    client.user.setActivity(">>help {page}");

    await fx.osu.get_access_token(); // get an osu access token for osu api-related commands
    setInterval(async () => { // refresh after expiration
        await fx.osu.get_access_token();
    }, process.env.OSU_ACCESS_TOKEN_EXPIRATION*1000);

    // check for all data files here
    // dynamically create if they dont exist
    fx.econ.updateEcon();
});

client.on("messageCreate", async (message) => {
    console.log(`[${message.author.tag}]: ${message.content}`); // log all messages (remove after this thing hits 3 servers)
    if (message.author.bot || !message.guild) return;

    if (message.content.startsWith("um")) {
        let msg = message.content.split(" ");
        let pizza = msg[0].replace(/m/g, "h");
        message.channel.send(pizza);
    }
    if (message.content.includes("727")) {
        message.channel.send("https://tenor.com/view/wysi-gif-21694798");
    }

    // ~~~ command handling ~~~
    if (message.content.startsWith(prefix)) {
        //let [command, ...args] = message.content.trim().slice(prefix.length).toLowerCase().split(/\s+/);
        let [command, ...args] = message.content.trim().slice(prefix.length).split(/\s+/); // array destructuring
        console.log(`Command received: ${command} | Server: ${message.guild.name}`); // log all commands received

        let osu_key = process.env.OSU_ACCESS_TOKEN;

        switch(command.toLowerCase()) {
            // general
            case "help":
                cmds.general.help(message, ...args);
                break;
            case "avatar":
                cmds.general.avatar(message, ...args);
                break;
            case "annoy":
            case "bug":
                cmds.general.annoy(client, message, ...args);
                break;
            case "nickname":
            case "nick":
                cmds.general.nickname(message, ...args);
                break;
            case "userinfo":
                cmds.general.userinfo(message, ...args);
                break;
            // fun
            case "roll":
                cmds.fun.roll(message, ...args);
                break;
            // economy
            case "work":
                cmds.econ.work(message, ...args);
                break;
            case "balance":
            case "bal":
                cmds.econ.balance(message, ...args);
                break;
            case "deposit":
            case "dep":
                cmds.econ.deposit(message, ...args);
                break;
            case "withdraw":
            case "with":
                cmds.econ.withdraw(message, ...args);
                break;
            case "send":
            case "give":
                cmds.econ.send(message, ...args);
                break;
            case "buy":
            case "purchase":
                cmds.econ.buy(message, ...args);
                break;
            case "inventory":
            case "inv":
                cmds.econ.inventory(message, ...args);
                break;
            case "shop":
            case "store":
                cmds.econ.shop(message, ...args);
                break;
            case "additem":
                cmds.econ.additem(message, ...args);
                break;
            case "addresponse":
                cmds.econ.addresponse(message, ...args);
                break;
            // osu
            case "osuset":
                cmds.osu.osuset(osu_key, message, ...args);
                break;
            case "osu":
                cmds.osu.osu(osu_key, message, ...args);
                break;
            case "recent":
            case "rs":
                cmds.osu.recent(osu_key, message, ...args);
                break;
            // dev
            case "todo":
                cmds.dev.todo(message, ...args);
                break;
            case "ping":
                cmds.dev.ping(client, message);
                break;
            default:
                message.channel.send("That command does not exist!");
        }
    }
});

// ඞ