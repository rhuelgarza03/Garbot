const fs = require("fs");

module.exports = function additem(message, ...args) {
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    let array = args.join(" ").match(/[^\s"]+|"([^"]*)"/gi);
    let noquotes = array.map(element => {
        return element.replace(/['"]+/g, '');
    })

    if (isNaN(noquotes[1])) {
        message.channel.send("price must be a number.");
    }
    else if (noquotes.length >= 3) {
        for (let i = 0; i < shop.length; i++) {
            if (noquotes[0].toLowerCase() == shop[i].name.toLowerCase()) {
                return message.channel.send("that item already exists in the shop.");
            }
        }
        shop.push({
            name: noquotes[0],
            price: parseInt(noquotes[1]),
            desc: noquotes[2]
        });
        fs.writeFile("src/Data/economy/shop.json", JSON.stringify(shop), () => { console.log("item added to shop.json") });
        message.channel.send("Item added to shop!");
    } 
    else {
        message.channel.send("not enough arguments.");
    }
}