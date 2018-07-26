const parse = require('urlencoded-body-parser')
const fetch = require('node-fetch')
const { send } = require('micro')
const { compose } = require('ramda')
const { handleErrors, requireSlackToken } = require('./middleware')
const { PANTRY_LIST_API_URL, SLACK_TOKEN, ADMIN_USER_NAME } = process.env

const api = {
  get: url =>
    fetch(url, {
      headers: {
        authorization: `Basic ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
}

const enhanced = compose(handleErrors, requireSlackToken)

module.exports = enhanced(async (req, res) => {
  const { user_name, team_domain } = await parse(req)

  if (!user_name || !team_domain) {
    send(res, 400, {
      text: 'user_name and team_domain parameters are required'
    })
  }

  if (user_name !== ADMIN_USER_NAME) {
    send(res, 200, {
      text: 'INTRUDER!  You\'re not Greg!'
    })
  }

  const email = `${user_name}@${team_domain}.com`
  const url = `${PANTRY_LIST_API_URL}/all_user_rankings?user=${email}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        authorization: `Basic ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if(response.status < 400) {
      send(res, 200, {
        text: 'Rankings have been cleared!'
      })
    } else {
      send(res, response.status, {
        text: response.statusText
      })
    }
  } catch (err) {
    send(res, err.status, response.statusText);
  }
})
