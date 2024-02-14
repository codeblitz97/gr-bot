const axios = require('axios').default;
const { AttachmentBuilder } = require('discord.js');
const path = require('path');
const { parseFile } = require('../../parseSerials');
const crypto = require('crypto');

const QUEUE_FILE_PATH = path.join(__dirname, 'queue.json');

module.exports = async (message, client) => {
  if (message.content.startsWith('!purchase')) {
    const args = message.content.split(' ');

    if (args.length >= 3) {
      const amount = args[1];
      const playerId = args[2];

      const numericAmount = parseInt(amount);

      const serials = parseFile(path.join(__dirname, 'serials.txt'));

      const matchingEntry = serials.find(
        (entry) => entry.amount === numericAmount
      );

      if (matchingEntry) {
        const { serial, pin } = matchingEntry;

        try {
          let queueList = [];
          try {
            const queueFileContent = await fs.readFile(
              QUEUE_FILE_PATH,
              'utf-8'
            );
            queueList = JSON.parse(queueFileContent);
          } catch (err) {
            console.error('Error reading queue file:', err.message);
          }

          const orderId = generateOrderId(playerId, amount);
          queueList.push(orderId);
          await fs.writeFile(
            QUEUE_FILE_PATH,
            JSON.stringify(queueList, null, 2)
          );

          for (const orderId of queueList) {
            await processOrder(orderId, playerId, amount, serial, pin, message);
            await sleep(15 * 60 * 1000);
          }
        } catch (error) {
          console.error('Error making purchase request:', error.message);
        }
      } else {
        message.reply('No matching entry found for the provided amount.');
      }
    } else {
      message.reply(
        'Invalid syntax. Please use: !purchase [amount] [playerId]'
      );
    }
  }
};

async function processOrder(orderId, playerId, amount, serial, pin, message) {
  try {
    const response = await axios.post(`${process.env.SERVER_URL}/purchase`, {
      playerId,
      amount,
      serial,
      pin,
      orderId,
    });

    const attachment = new AttachmentBuilder(
      await response.data.images[2].content,
      { name: 'message.png' }
    );

    await message.channel.send({
      message: 'Successfully purchased',
      files: [attachment],
    });

    const queueFileContent = await fs.readFile(QUEUE_FILE_PATH, 'utf-8');
    const queueList = JSON.parse(queueFileContent);
    const updatedQueue = queueList.filter((id) => id !== orderId);
    await fs.writeFile(QUEUE_FILE_PATH, JSON.stringify(updatedQueue, null, 2));
  } catch (error) {
    console.error('Error processing order:', error.message);
  }
}

function generateOrderId(playerId, amount) {
  const data = playerId + amount;
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  return hash.substring(0, 12);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
