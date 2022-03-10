const fs = require("fs");
const fx = require("../../Functions/load_fx");
module.exports = function addresponse(message, ...args) {
    let list = JSON.parse(fs.readFileSync("src/Data/economy/workresponses.json"));

    let response = message.content.split(/\s+/);
    response.shift();
    response = response.join(" ");

    if (!response.includes("{x}")) {
        fx.economy.econActionEmbed("Error", "Work response missing ``{x}``", message, "#FF0000");
    } else {
        list.push(response);
        fs.writeFile("src/Data/economy/workresponses.json", JSON.stringify(list), () => { console.log("response added to workresponses.json") });
        fx.economy.econActionEmbed("Success!", "Work response added!", message, "#333333");
    }
}