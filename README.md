# v2bron

![Discord Bot](https://img.shields.io/badge/Discord-Bot-7289DA?style=flat-square&logo=discord)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript)

A versatile Discord bot with music playback, moderation, and utility features built with discord.js. Feel free to browse how v2bron works. It is relatively simple, but it's all my friends and I need to have fun and make our lives a little easier!

## command reference
| command       | description                                  | usage                          |
|---------------|----------------------------------------------|--------------------------------|
| `/kick`       | kick a user                                  | `/kick @username`              |
| `/remindme`   | set a reminder                               | `/remindme 60 Do homework`     |
| `/play`       | play audio from url or query                 | `/play https://youtu.be/...`   |
| `/stop`       | stop playback and clear queue                | `/stop`                        |
| `/pause`      | pause current track                          | `/pause`                       |
| `/resume`     | resume paused track                          | `/resume`                      |
| `/skip`       | skip to next track in queue                  | `/skip`                        |
| `/queue`      | show current queue                           | `/queue`                       |
| `/nowplaying` | display currently playing track              | `/nowplaying`                  |

## built with
- **discord.js** - main discord API wrapper
- **@discordjs/voice** - voice connection handling
- **play-dl** - audio streaming from various sources
- **dotenv** - environment variable management

## architecture
- event-driven architecture using discord.js
- audio player with queue management system
- permission-based command execution
- slash command integration for modern discord experience

## how to use

1. **prerequisites**
   - Node.js v16 or higher
   - discord bot token
   - discord developer application

2. **installation**
   ```bash
   git clone https://github.com/{your-repo}/v2bron.git
   cd v2bron
   npm install

3. **configuration**
    
    create a .env file with your bot token:
    ```bash
    TOKEN=your-discord-bot-token

4. **run bot**
    ```bash
    node bot.js