[![Kurasad#2521](https://img.shields.io/badge/Creator-Kurasad%232521-%23ff0092)](https://twitter.com/iKurasad) 

<p>
  <a href="https://github.com/DPulavarthy/rita" target="_blank">
    <img src="assets/rita.png" alt="Logo">
    <a href="https://www.pixiv.net/en/users/6831531">Credit to the artist</a>
  </a>

  <h3 align="center"> Rita </h3>
  <p align="center">
    A Discord bot with some cool features
    <br />
    <a href="https://kura.gq"><strong> Visit the owner » </strong></a>
    <br />
    <br />
    <a href="https://support.jonin.gq"> Contact </a>
    ·
    <a href="https://github.com/DPulavarthy/rita/issues"> Report Bug </a>
    ·
    <a href="https://github.com/DPulavarthy/rita/issues"> Request Feature </a>
  </p>
</p>

### About the bot
Rita is a bot for simple use and only responds to the owner! Rita is your bot helper, created in Discord.JS v12 this bot tries to be lightweight and fast. Some of the features are an AI chatbot, text tags, image tags, and simple [music commands](https://github.com/eritislami/evobot).

***Note:*** Due to the existence of text/image tags, the bot cannot be hosted on [Heroku](http://heroku.com/), my version is hosted on a Raspberry Pi Zero W.

### Image tags
![IMG_TAGS](assets/img_tags.gif)

### Text tags
![TEXT_TAGS](assets/text_tags.gif)

### How to Use
***Note:*** This bot's code complexity not meant for beginners and might be confusing, if you do not understand how it works I will be glad to help, just contact me on Discord
[Kurasad#2521](https://discord.com/users/476812566530883604), but if you do not understand anything this might not be the bot for you, yet.

After forking the project add the proper information for the following files.

Find `.env.example` and rename the file to `.env` and open the file, the following should be shown
```
TOKEN=DISCORD_BOT_TOKEN
PREFIX=DISCORD_BOT_PREFIX
```
Fill in with the proper information (There are many guides on how to make a bot application in the [Discord Developer Portal](https://discord.com/developers/applications) and get a bot token), The prefix checks for args instead of characters so use a prefix such as `rita pls` instead of `!r`
Once the `.env` file is properly filled out open the following directory `./resources/util.js.example`

Fill out the information with the required data
```js
module.exports = {
    owner: {
        id: "OWNER_DISCORD_ID",
        link: "OWNER_SOCIAL_LINK",
        site: "OWNER_WEBSITE_LINK",
    },
    main: "#MAIN_EMBED_COLOR_HEX",
    failed: "#FF0000",
    loading: "#2E6FD6",
    key: {
        alexa: "aw2plm",
        google: "GOOGLE_API_KEY"
    }
}
```
***Note:*** The Alexa API key is a public key from [NPM alexa-bot-api](https://www.npmjs.com/package/alexa-bot-api)

***Note:*** The owner id is important, without it the bot will not respond to anyone. Remember, this is a private bot so it will only respond to the owner

Then, rename the folder `data.example` to just `data`

***Note:*** The data folder is where data for the bot is saved, without renaming it, the bot will likely crash.

Once those three things are updated, 'cd' to the bot directory

run `npm i` and then `node rita.js` 

***Note:*** The index file is rita.js and not index.js

### Other
Feedback is an amazing thing and feature additions are awesome, but to keep this bot simple I will try to only accept requests that do not change the bot much or majorly impact the speed.

I am the bot creator of [Jonin](https://top.gg/bot/662517805983334416) and after many requests wanted to make a simpler bot for public use.
