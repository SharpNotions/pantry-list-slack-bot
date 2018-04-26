const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')

const { send } = require('micro')

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

const sendResponse = (res, exp, data) => {
  switch (exp) {
    case 'token':
      send(res, 200, {
        response_type: 'ephemeral',
        text:
          "Sorry, that didn't work. Authorization is required to use the `/add` slash command."
      })
      return
    case 'required':
      send(res, 200, {
        response_type: 'ephemeral',
        text:
          "Sorry, that didn't work. Item name is required. Usage hint: `/add Item Name|Description`."
      })
      return
    case 'error':
      send(res, 200, {
        response_type: 'ephemeral',
        text: 'There was a problem with your request. Please try again.'
      })
      return
    default:
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
      return
  }
}

const validateRequest = {
  text: (res, text) => {
    if (text === '') {
      sendResponse(res, 'required')
    }
  },

  token: (res, token, slackVerificationToken) => {
    if (token !== slackVerificationToken) {
      sendResponse(res, 'token')
    }
  }
}

module.exports = async (req, res) => {
  try {
    const { text, team_domain, token, user_name } = await parse(req)

    validateRequest.token(res, token, process.env.SLACK_VERIFICATION_TOKEN)
    validateRequest.text(res, text)

    const data = parseRequestText(text)
    const email = `${user_name}@${team_domain}.com`
    const url = `${process.env.PANTRY_LIST_API_URL}/item?user=${email}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Basic ${process.env.SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    response.ok
      ? sendResponse(res, 'default', data)
      : sendResponse(res, 'error')
  } catch (error) {
    console.log(error)
  }
}
