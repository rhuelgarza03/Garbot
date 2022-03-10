module.exports = {
    osu: {
        osuset: require("./osu/osuset"),
        osu: require("./osu/standard"),
        recent: require("./osu/recent")
    },
    general: {
        help: require("./general/help"),
        avatar: require("./general/avatar"),
        annoy: require("./general/annoy"),
        nickname: require("./general/nickname"),
        userinfo: require("./general/userinfo")
    },
    fun: {
        roll: require("./fun/roll")
    },
    economy: {
        additem: require("./economy/additem"),
        addresponse: require("./economy/addresponse"),
        balance: require("./economy/balance"),
        buy: require("./economy/buy"),
        deposit: require("./economy/deposit"),
        inventory: require("./economy/inventory"),
        send: require("./economy/send"),
        shop: require("./economy/shop"),
        toss: require("./economy/toss"),
        withdraw: require("./economy/withdraw"),
        work: require("./economy/work")
    },
    dev: {
        ping: require("./dev/ping"),
        prefix: require("./dev/prefix"),
        todo: require("./dev/todo")
    }
}