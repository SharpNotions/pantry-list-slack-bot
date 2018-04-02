const fetch = require('node-fetch')
const { json } = require('micro')
const { getUserEmail } = require('helpers')
const GET_USER_RANKINGS = 'GET_USER_RANKINGS'

const dialogflow = async (req, res) => {
  const { result, originalRequest } = await json(req)
  const { user } = originalRequest.data.data.event
  const userEmail = await getUserEmail(user)
  const intent = result.metadata.intentName

  switch (intent) {
    case GET_USER_RANKINGS:
      return getUserRanking(userEmail)
    default:
      return 'Uh oh'
  }
}

function getTextForResponse() {
  const responses = [
    "Here's your list...",
    'Voila!',
    'Your list, as requested:',
    'Here ya go!',
    'Typing in urls for stuff is so 2017',
    'Your list is:',
    'At your service:',
    'No problem!',
    'At once your holiness!',
    'This is so much better than a whiteboard.',
    'Ask and ye shall receive:',
    "Aye Aye Cap'n"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

async function getUserRanking(user) {
  const url = `https://pantry-list-api.herokuapp.com/user_ranking?user=${user}`

  const userRankings = await fetch(url, {
    headers: { authorization: `Bearer ${process.env.SLACK_TOKEN}` }
  })
    .then(response => response.json())
    .then(rankings =>
      rankings.map((item, index) => ({
        text: `${index + 1}. ${item.item_name}`
      }))
    )

  const slack_message = {
    text: getTextForResponse(),
    attachments: userRankings
  }

  return {
    data: { slack: slack_message }
  }
}

module.exports = dialogflow
