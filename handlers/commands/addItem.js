const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')
const { send } = require('micro')
const { compose } = require('ramda')
const {
  handleErrors,
  requireSlackToken,
  requireText,
  logRequests
} = require('./middleware')
const { getUserEmail } = require('../../helpers')
const { PANTRY_LIST_API_URL, SLACK_TOKEN } = process.env

const parseRequestText = text => {
  const descriptionIncluded = text.includes('|')
  let parsedRequestText

  if (descriptionIncluded) {
    splitText = text.split('|')
    parsedRequestText = {
      item_name: splitText[0],
      item_details: { description: splitText[1] }
    }
  } else {
    parsedRequestText = {
      item_name: text,
      item_details: { description: '' }
    }
  }
  return parsedRequestText
}

const createAttachment = data => {
  let attachment = { title: data.item_name }

  if (data.item_details && data.item_details.description !== '') {
    attachment.text = ` \n${data.item_details.description}`
  }
  return attachment
}

const enhanced = compose(
  logRequests,
  handleErrors,
  requireSlackToken,
  requireText
)

module.exports = enhanced(async (req, res) => {
  const { text, team_domain, token, user_name, user_id } = await parse(req)

  const data = parseRequestText(text)
  const email = await getUser(user_id)
  const url = `${PANTRY_LIST_API_URL}/item?user=${email}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Basic ${SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('error')
  }

  send(res, 200, {
    response_type: 'ephemeral',
    text: `You successfully added your item to the pantry list.`,
    attachments: [
      createAttachment(data),
      {
        title: 'Open Pantry List',
        title_link: 'https://pantry-list-frontend.now.sh/'
      }
    ]
  })
})
