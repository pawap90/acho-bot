![achobot-gh-banner](https://user-images.githubusercontent.com/2507959/152519862-b1d7116e-dade-4ed8-9ac5-f9eefeeff520.png)

Configure your chatbot commands in Notion and AchoBot will use them during your streams:

![notion-database](https://user-images.githubusercontent.com/2507959/152531729-8b117829-9965-41a6-9455-b10dbf4cda40.png)


# Dependencies
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

# Quick start
1. Setup your Notion Database. Generate it using the following Notion template: [[Template] AchoBot](https://familiar-freckle-76f.notion.site/350b171ebc30462fbdcb8391cb2f088a?v=0cf2e1a5f5bc476e827d2705e2bdc223)

> Press "Duplicate" to copy the template in your Notion. The template comes with a few sample commands; feel free to delete them and add your own.

2. Clone the repo 
```
git clone https://github.com/pawap90/acho-bot
```

3. Build the project
   
```
npm run build
```
> You can find the transpiled code in the `_dist` folder.

4. Make sure to setup all the [Environment variables](#environment-variables)

5. Run it
```
npm start
```
6. Open the site in your browser (E.g: http://localhost:5000 if you are running it locally) and press the link to login with your bot's Twitch account. This will give the application permissions to use the chat in your bot's behalf, so it can start answering to commands.

> Once you start streaming, if the service is running and you authorized the bot (step 6), the bot will login to the chat automatically. Give the bot's account moderator permissions so it can reply to commands without limitations. Type this in the chat: `/mod bot_username`

# Development

1. Clone the repo 
```
git clone https://github.com/pawap90/acho-bot
```

2. Install dependencies: Run the following command from the project's root folder:

```sh
npm install
```

3. Setup a `.env` file in the root as explaned in the [Environment variables](#environment-variables) section.

4. Start the local development server: 

```sh
npm run dev
```

# Environment variables
These are the environment variables required to run the project. Make sure set the values with your own data.

```
TWITCH_BOT_CLIENTID=<your-twitch-clientid>
TWITCH_BOT_CLIENTSECRET=<your-twitch-secret>
TWITCH_BOT_USERNAME=<your-bots-username>
TWITCH_CHANNELS=<your-twitch-channel>
TMI_DEBUG=true
TMI_LOGLEVEL=info
PORT=5000
TWITCH_BOT_REDIRECTURI=http://localhost:5000/api/twitch/auth/token
SESSION_SECRET=<a-random-value>
NOTION_APIKEY=<your-notion-api-key>
NOTION_DATABASEID=<your-notion-database-id>
NOTION_VERSION=2021-08-16
```
When running the project locally using `npm run dev` you should set the environment variables within a `.env` file in the root. 
