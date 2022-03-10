const fs = require("fs");
module.exports = function checkPrefix(defaultPrefix, guildId) {
    let prefs = JSON.parse(fs.readFileSync("src/Data/serverPrefs.json"));
    if (prefs[guildId].prefix) {
        return prefs[guildId].prefix;
    } else {
        return defaultPrefix;
    }
}