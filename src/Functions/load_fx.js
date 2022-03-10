module.exports = {
    osu: {
        assignUser: require("./osufx/assignuser"),
        findUser: require("./osufx/finduser"),
        banchoapi: require("./osufx/banchoapi")
    },
    general: {
        checkFiles: require("./generalfx/checkFiles"),
        checkPrefix: require("./generalfx/checkPrefix"),
        generalEmbed: require("./generalfx/generalEmbed"),
        numberWithCommas: require("./generalfx/numberWithCommas"),
        secondsToHms: require("./generalfx/secondsToHms")
    },
    economy: {
        econActionEmbed: require("./economyfx/econActionEmbed"),
        parseMentions: require("./economyfx/parseMentions")
    }
}