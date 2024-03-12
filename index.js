const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');
const path = require('path');

require('dotenv').config();

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((i) => {
    return GatewayIntentBits[i];
  }),
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  devGuildIds: [
    '1207206122868441139',
    '1164968463492722688',
    '1201154718634885143',
  ],
  devUserIds: [
    '1153367065537822772',
    '1201153624718454845',
    '1074981842886864896',
  ],
  bulkRegister: true,
});

(async () => {
  await client.login(process.env.TOKEN);
})();
