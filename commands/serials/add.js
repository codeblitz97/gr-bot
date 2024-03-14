const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: {
    name: 'bd-add',
    description: 'Add a serial key',
    options: [
      {
        name: 'serial',
        description: 'Enter serial',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'amount',
        description: 'Enter amount',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'pin',
        description: 'Enter pin',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  run: async ({ interaction, client, handler }) => {
    try {
      const serial = await interaction.options.getString('serial');
      const amount = await interaction.options.getNumber('amount');
      const pin = await interaction.options.getString('pin');

      // Load existing serials from the file
      let existingSerials = [];
      try {
        const serialsFileContent = fs.readFileSync('serials.json', 'utf-8');
        existingSerials = JSON.parse(serialsFileContent);
      } catch (error) {
        console.error('Error reading serials file:', error.message);
      }

      // Add the new serial
      existingSerials.push({ serial, amount, pin });

      // Write the updated serials back to the file
      fs.writeFileSync(
        'serials.json',
        JSON.stringify(existingSerials, null, 2)
      );

      // Respond to the interaction
      await interaction.reply({
        content: 'Serial key added successfully!',
        ephemeral: true, // This makes the response only visible to the user who triggered the command
      });
    } catch (error) {
      console.error('Error adding serial key:', error.message);
      await interaction.reply({
        content:
          'An error occurred while adding the serial key. Please try again later.',
        ephemeral: true,
      });
    }
  },

  options: {
    devOnly: true,
    userPermissions: ['Administrator', 'AddReactions'],
    botPermissions: ['Administrator', 'AddReactions'],
    deleted: false,
  },
};
