const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')
const { send } = require('micro')
const { compose } = require('ramda')
const { handleErrors, requireSlackToken } = require('./middleware')
const { PANTRY_LIST_API_URL, SLACK_TOKEN } = process.env

const api = {
  get: url =>
    fetch(url, {
      headers: {
        authorization: `Basic ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
}

async function getTotalRankings(user) {
  const url = `${PANTRY_LIST_API_URL}/top_rankings?user=${user}`
  const topRankings = await api
    .get(url)
    .then(response => response.json())
    .then(rankings => rankings.fiboRankings.map(buildRankingList))
    .catch(err => {
      throw new Error('error')
    })

  return {
    response_type: 'ephemeral',
    text: 'Top Ranking: ',
    attachments: topRankings
  }
}

const buildRankingList = (item, index) => ({
  text: `${index + 1}. ${item.item_name}`
})

const enhanced = compose(handleErrors, requireSlackToken)

module.exports = enhanced(async (req, res) => {
  const { text, team_domain, token, user_name } = await parse(req)
  const email = `${user_name}@${team_domain}.com`

  const response = await getTotalRankings(email)

  send(res, 200, response)
})
