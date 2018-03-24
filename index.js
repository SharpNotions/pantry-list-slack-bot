const { json, send } = require('micro')
const { router, post } = require('microrouter')
const { WebClient } = require('@slack/client');
const itemAdded = require('./item-added');

const token = process.env.SLACK_TOKEN;

const events = async (req, res) => {
  const data = await json(req)
  if (data && data.type === 'url_verification') {
    return res.end(data.challenge);
  }
  send(res, 200)
  if (data.event.type === 'message' && data.event.subtype !== 'bot_message') {
    const conversationId = data.event.channel
    const web = new WebClient(token)

    web.chat.postMessage({ channel: conversationId, text: 'It works!' })
    .then((response) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', response.ts);
    })
    .catch(console.error);
  }
}

module.exports = router(
  post('/events', events),
  post('/item-added', itemAdded)
)
