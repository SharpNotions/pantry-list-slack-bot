const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')

const { send } = require('micro')

module.exports = async (req, res) => {
  const { text, token } = await parse(req);
  if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
    send(res, 401, 'Token did not equal verification token')
  }
  send(res, 200)
  const url = 'https://pantry-list-api-pr-16.herokuapp.com/item'
  fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({item_name: text})
  });
}
