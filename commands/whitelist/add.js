const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: {
    name: 'whitelist-add',
    description: 'Add a user to whitelist',
    options: [
      {
        name: 'user-id',
        description:
          'Enter the user id of the user you want to add in whitelist',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  run: async ({ interaction, client, handler }) => {
    const whiteListUser = interaction.options.getString('user-id');

    let jsonData = {};
    try {
      jsonData = JSON.parse(fs.readFileSync('whitelist.json', 'utf8'));
    } catch (error) {
      console.error('Error reading whitelist.json:', error);
    }

    if (!jsonData.whitelistedUserIDs) {
      jsonData.whitelistedUserIDs = [];
    }
    jsonData.whitelistedUserIDs.push(whiteListUser);

    fs.writeFile(
      'whitelist.json',
      JSON.stringify(jsonData, null, 2),
      'utf8',
      async (err) => {
        if (err) {
          return interaction.reply({
            content: `Error writing to whitelist.json: ${err.message}`,
          });
        } else {
          await interaction.reply({
            content: `User with id ${whiteListUser} added to whitelist`,
          });
        }
      }
    );
  },

  options: {
    devOnly: true,
    userPermissions: ['Administrator', 'AddReactions'],
    botPermissions: ['Administrator', 'AddReactions'],
    deleted: false,
  },
};
