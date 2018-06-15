const fetch = require('node-fetch')
const { json } = require('micro')
const { getUserEmail } = require('helpers')
const GET_USER_RANKINGS = 'GET_USER_RANKINGS'
const { PANTRY_LIST_API_URL, SLACK_TOKEN } = process.env

const api = {
  get: url => fetch(url, {
    headers: {
      authorization: `Basic ${SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
}

const dialogflow = async (req, res) => {
  const { queryResult, originalDetectIntentRequest } = await json(req)
  const intent = queryResult.intent.displayName
  const { user } = originalDetectIntentRequest.payload.data.event
  const userEmail = await getUserEmail(user)

  switch (intent) {
    case GET_USER_RANKINGS:
      return getUserRanking(userEmail)
    default:
      return 'Uh oh'
  }
}

async function getUserRanking(user) {
  const url = `${PANTRY_LIST_API_URL}/user_ranking?user=${user}`

  const userRankings = await api.get(url)
    .then(response => response.json())
    .then(rankings =>
      rankings.map((item, index) => ({
        text: `${index + 1}. ${item.item_name}`
      }))
    )

  const slack_message = {
    text: 'Your Ranking:',
    attachments: userRankings
  }

  return {
    payload: { slack: slack_message }
  }
}

module.exports = dialogflow
