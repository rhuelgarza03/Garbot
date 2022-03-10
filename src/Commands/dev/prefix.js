const fs = require("fs");

module.exports = function prefix(message, ...args) {
    let prefs = JSON.parse(fs.readFileSync("src/Data/serverPrefs.json"));
    if (args[0]) {
        prefs[message.guild.id] = { prefix: args[0] };
        fs.writeFile("src/Data/serverPrefs.json", JSON.stringify(prefs), () => {console.log(`Guild ${message.guild.id}'s prefix changed to ${args[0]}`)} );
        message.channel.send(`Server's prefix changed to **${args[0]}**`);
    } else {
        message.channel.send(`${message.guild.name}'s set prefix is \`\`${prefs[message.guild.id].prefix}\`\`.`)
    }
}