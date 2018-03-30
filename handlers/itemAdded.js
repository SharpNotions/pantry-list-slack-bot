const { json } = require('micro')
const { WebClient } = require('@slack/client');
const { SLACK_TOKEN, CHANNEL_ID } = process.env;

const attachments = [{
    "title": "Open Pantry List",
    "title_link": "https://pantry-list-frontend.now.sh/",
    // "actions": [{
    //   "name": "open",
    //   "text": "Open Pantry App",
    //   "type": "button",
    //   "value": "open"
    // }]
  }]

module.exports = async (req, res) => {
  const body = await json(req);
  const text = `${body.item_name || 'An item'} was just added to the pantry list`
  const { chat } = new WebClient(SLACK_TOKEN)
  return chat.postMessage({
    channel: CHANNEL_ID,
    text,
    attachments
  })
  .then(console.log)
  .catch(console.error);
}
