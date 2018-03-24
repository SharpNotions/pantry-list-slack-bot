const { json } = require('micro')
const { IncomingWebhook } = require('@slack/client');

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
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL, {});
  return webhook.send(message, (err, response) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', response);
    }
  });
}
