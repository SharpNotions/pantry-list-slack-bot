const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')
const { send } = require('micro')
const { getUserEmail } = require('../../helpers')
const { SLACK_VERIFICATION_TOKEN, SLACK_TOKEN } = process.env
const createAttachment = data => {
  let attachment = {
    color: '#7c4be0',
    title: data.item_name
  }

  if (data.item_details && data.item_details.description !== '') {
    attachment.text = ` \n${data.item_details.description}`
  }

  return attachment
}

const formatDefaultResponse = items => {
  return items.length > 0
    ? {
        text: `*${items.length} items found*:`,
        attachments: items.map(data => createAttachment(data))
      }
    : {
        text: `*No items found*.`
      }
}

const sendResponse = (res, exp, items = []) => {
  switch (exp) {
    case 'token':
      send(res, 200, {
        response_type: 'ephemeral',
        text:
          "Sorry, that didn't work. Authorization is required to use the `/list` slash command."
      })
      return
    case 'error':
      send(res, 200, {
        response_type: 'ephemeral',
        text: 'There was a problem with your request. Please try again.'
      })
      return
    default:
      send(res, 200, formatDefaultResponse(items))
      return
  }
}

const validateRequest = {
  token: (res, token, slackVerificationToken) => {
    if (token !== slackVerificationToken) {
      sendResponse(res, 'token')
    }
  }
}

module.exports = async (req, res) => {
  try {
    const { team_domain, token, user_name, user_id } = await parse(req)

    validateRequest.token(res, token, SLACK_VERIFICATION_TOKEN)

    const email = await getUserEmail(user_id)
    const url = `${
      process.env.PANTRY_LIST_API_URL
    }/unranked_items?user=${email}`
    const response = await fetch(url, {
      headers: {
        authorization: `Basic ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    const items = await response.json()

    response.ok
      ? sendResponse(res, 'default', items)
      : sendResponse(res, 'error')
  } catch (error) {
    console.log(error)
    sendResponse(res, 'error')
  }
}
