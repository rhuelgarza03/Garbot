module.exports = function parseMentions(message) {
    if (message.mentions.members.first()) {
        return message.mentions.members;
    } else {
        return null;
    }
}