const { json } = require('micro')
const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url, {});

const attachments = {
  "attachments": [{
    "text": "Do some stuff!",
    "actions": [{
      "name": "open",
      "text": "Open Pantry App",
      "type": "button",
      "value": "open"
    }]
  }]
}

module.exports = async (req, res) => {
  const body = await json(req)
  const message = {
    "text": `${body.item_name || 'An item'} was just added to the pantry list`,
    "callback_id": "item_added_action"
  };
  return webhook.send(message, (err, response) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', response);
    }
  });
}
