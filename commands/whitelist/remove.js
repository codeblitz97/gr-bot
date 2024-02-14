const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: {
    name: 'whitelist-remove', // Change the command name to better reflect its purpose
    description: 'Remove a user from the whitelist',
    options: [
      {
        name: 'user-id',
        description:
          'Enter the user id of the user you want to remove from the whitelist',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  run: async ({ interaction, client, handler }) => {
    const removedUserId = interaction.options.getString('user-id');

    let jsonData = {};
    try {
      jsonData = JSON.parse(fs.readFileSync('whitelist.json', 'utf8'));
    } catch (error) {
      console.error('Error reading whitelist.json:', error);
      return interaction.reply({
        content: `Error reading whitelist.json: ${error.message}`,
      });
    }

    if (jsonData.whitelistedUserIDs) {
      // Remove the specified user ID from the whitelist
      jsonData.whitelistedUserIDs = jsonData.whitelistedUserIDs.filter(
        (userId) => userId !== removedUserId
      );
    }

    // Write the updated data back to the JSON file
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
            content: `User with id ${removedUserId} removed from the whitelist`,
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
