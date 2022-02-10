# Garbot
An all-purpose discord bot with many features.

You can download this repo and run him yourself with ``npm run start``. 
You will need node.js and the libraries from ``package.json`` installed.

Currently has the following features: 
- general commands that can retrieve a user's avatar or info
- economy with a store and user-suggested responses/items
- osu! api integration to check recent scores and profile stats
- dynamic file creation

Command list:

    { cmd: ">>help {page}", desc: "Display a helpful list of commands." },
    { cmd: ">>userinfo {@member}", desc: "Display some basic info on a member." },
    { cmd: ">>avatar {@member}", desc: "Display a server member's avatar." },
    { cmd: ">>nickname [@member] [nickname]", desc: "Set a member's nickname." },
    { cmd: ">>annoy [message]", desc: "annoy the dev by sending them a direct message." },

    { cmd: ">>osu {osu username}", desc: "Get stats for an osu! standard user profile. You can also tie a profile to your account with >>osuset" },
    { cmd: ">>osuset [osu username]", desc: "Adds an osu profile to your discord account for command convenience." },
    { cmd: ">>recent [osu username/@member]", desc: "Display a user's most recent play. (failed scores not included yet)" },

    { cmd: ">>roll {max number} ", desc: "Roll a random number from 1 to 100, or the number specified." },

    { cmd: ">>work", desc: "Work to earn money in Garbot's economy! Doing this automatically creates a profile for you." },
    { cmd: ">>balance {@member}", desc: "Display a member's economy balance. Requires an economy profile." },
    { cmd: ">>deposit [funds]", desc: "Deposit cash into your bank account. Requires an economy profile." },
    { cmd: ">>withdraw [funds]", desc: "Withdraw cash from your bank account. Requires an economy profile." },
    { cmd: ">>send [@member] [funds]", desc: "Send cash to another user. Requires an economy profile." },
    { cmd: ">>buy [item] {quantity}", desc: "Buy an item from the economy store! Requires an economy profile." },
    { cmd: ">>inventory {@member}", desc: "Display a member's inventory. Requires an economy profile." },
    { cmd: ">>store {page}", desc: "Browse through the economy store! Requires an economy profile." },
    { cmd: ">>additem [\"name\"] [\"price\"] [\"item description\"]", desc: "Add an item to the economy store." },
    { cmd: ">>addresponse [response]", desc: "Add a work response for the >>work command." },

    { cmd: ">>todo [message]", desc: "Display my todo list. optional parameters are ``add`` and ``delete``." },
    { cmd: ">>prefix [prefix]", desc: "Set this server's command prefix. Default is ``>>``." },
    { cmd: ">>ping", desc: "Check Garbot's ping." }

I am always open to suggestions and plan to continue working on this bot for the forseeable future (I have tons of ideas!). You can contact me on discord at ``garhu#9302``

Garbot is a discord.js bot I created on November 20, 2021.
