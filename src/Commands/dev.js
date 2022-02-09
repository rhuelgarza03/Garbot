const fs = require("fs");

const fx = {
    gen: require("../Functions/gen")
}

function todo(message, ...args) {
    let actions = args.map(element => {
        return element.toLowerCase();
    });
    let list = JSON.parse(fs.readFileSync("src/Data/todo.json"));

    if (actions[0] === "add" && args[1]) {
        list.push(args.slice(1).join(" "));
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log(`index ${list.length} added to todo.json`)} );
        message.channel.send(`Index ${list.length} added to todo list.`);
    }
    else if (actions[0] === "delete" && !isNaN(args[1])) {
        let num = parseInt(args[1]);
        list.splice(num-1, 1);
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log(`index ${num} removed from todo.json`)} );
        message.channel.send(`Index ${num} removed from todo list.`);
    } 
    else {
        for (let i = 0; i < list.length; i++) {
            list[i] = (i+1) + ". " + list[i];
        }
        fx.gen.generalEmbed("Todo list:", list.join(" \r\n"), message, "#333333");
    }
}

function prefix(message, ...args) {
    let prefs = JSON.parse(fs.readFileSync("src/Data/serverPrefs.json"));
    if (args[0]) {
        prefs[message.guild.id] = { prefix: args[0] };
        fs.writeFile("src/Data/serverPrefs.json", JSON.stringify(prefs), () => {console.log(`Guild ${message.guild.id}'s prefix changed to ${args[0]}`)} );
        message.channel.send(`Server's prefix changed to **${args[0]}**`);
    } else {
        message.channel.send(`${message.guild.name}'s set prefix is \`\`${prefs[message.guild.id].prefix}\`\`.`)
    }
}

function ping(client, message) {
    message.channel.send(`${client.ws.ping}ms`);
}

module.exports = {
    todo,
    prefix,
    ping
}