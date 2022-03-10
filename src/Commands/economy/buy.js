const fs = require("fs");
const fx = require("../../Functions/load_fx");
module.exports = function buy(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    if (args[0]) {
        // dumb code to get item name and amount of items
        let item = message.content.split(/\s+/);
        item.shift();
        let amount = 1; // default amount is 1 if not specified
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
            let cost = Math.floor(amount*parseInt(shop[itemIndex].price));

            if (!obj[message.author.id]) {
                fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
            } 
            else if (cost > obj[message.author.id].cash) {
                fx.economy.econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
            }
            else {
                if (!obj[message.author.id].inv[item]) obj[message.author.id].inv[item] = 0;
                obj[message.author.id].inv[item] += amount;
                obj[message.author.id].cash -= cost;
                fx.economy.econActionEmbed("Purchase successful!", `You bought ${amount} ${item}(s)! You can check them in your inventory.`, message, "#333333");
                fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => { console.log(`user ${message.author.id} purchased ${amount} ${item}(s)`)} );
            }
        } else {
            fx.economy.econActionEmbed("Error", "That item does not exist!", message, "#FF0000");
        }
    } else {
        fx.economy.econActionEmbed("Error", "No item specified.", message, "#FF0000");
    }
}