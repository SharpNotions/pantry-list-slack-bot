const { json } = require('micro')
const { WebClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN;

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
  const message = {
    "text": `${body.item_name || 'An item'} was just added to the pantry list`,
    "callback_id": "item_added_action"
  };
  const web = new WebClient(token)
  const { channel } = await web.channels.info({channel: 'C965FPQNQ'})
  return channel.members.map(async member => {
    const { channel } = await web.im.open({ user: member });
    return web.chat.postMessage({
      channel: channel.id,
      text: message.text, attachments
    })
    .then(console.log)
    .catch(console.error)
  })
}
