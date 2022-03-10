const fs = require("fs");
const fx = require("../../Functions/load_fx");
module.exports = function toss(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    if (args[0]) {
        let item = message.content.split(/\s+/);
        item.shift();
        let amount = 1;
        if (!isNaN(args[args.length - 1])) {
            item.pop();
            amount = Math.floor(args[args.length - 1]);
        }
        item = item.join(" ");
        let isItem = false;
        let itemIndex;
        for (let i = 0; i < shop.length; i++) {
            if (item.toLowerCase() == shop[i].name.toLowerCase()) { 
                isItem = true;
                itemIndex = i;
            }
        }
        if (isItem) {
            if (!obj[message.author.id]) {
                fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
            } 
            else if (!obj[message.author.id].inv[item] || obj[message.author.id].inv[item] === null) {
                delete obj[message.author.id].inv[item];
                fx.economy.econActionEmbed("Error", "You don't own that item.", message, "#FF0000");
                fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {} );
            }
            else if (amount > obj[message.author.id].inv[item]) {
                fx.economy.econActionEmbed("Error", "Not enough items!", message, "#FF0000");
            }
            else {
                obj[message.author.id].inv[item] -= amount;
                fx.economy.econActionEmbed("Tossed!", `You threw away ${amount} ${item}(s).`, message, "#333333");
                if (obj[message.author.id].inv[item] <= 0) delete obj[message.author.id].inv[item];
                fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => { console.log(`user ${message.author.id} tossed ${amount} ${item}(s)`)} );
            }
        } else {
            fx.economy.econActionEmbed("Error", "That item does not exist!", message, "#FF0000");
        }
    } else {
        fx.economy.econActionEmbed("Error", "No item specified.", message, "#FF0000");
    }
}