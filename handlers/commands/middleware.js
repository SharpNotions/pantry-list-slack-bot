const { send } = require('micro')
const parse = require('urlencoded-body-parser')
const SumoLogger = require('sumo-logger')
const { SLACK_VERIFICATION_TOKEN, LOGGER_ENDPOINT } = process.env
const sumoLogger = new SumoLogger({ endpoint: LOGGER_ENDPOINT })

const requireSlackToken = fn => async (req, res) => {
  const { token } = await parse(req)
  if (!token || token !== SLACK_VERIFICATION_TOKEN) {
    const err = new Error()
    err.name = 'token'
    err.message =
      "Sorry, that didn't work. Authorization is required to use the `/add` slash command."
    throw err
  }
  return await fn(req, res)
}

const requireText = fn => async (req, res) => {
  const { text } = await parse(req)
  if (!text || text === '') {
    const err = new Error()
    err.name = 'required'
    err.message =
      "Sorry, that didn't work. Item name is required. Usage hint: `/add Item Name|Description`."
    throw err
  }
  return await fn(req, res)
}

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    sumoLogger.log({ err })
    switch (err.name) {
      case 'token':
      case 'required':
        send(res, 200, {
          response_type: 'ephemeral',
          text: err.message
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
          text: 'There was a problem with your request. Please try again.'
        })
        return
    }
  }
}

const logRequests = fn => async (req, res) => {
  const body = await parse(req).catch(() => ({}))
  sumoLogger.log({
    method: req.method,
    url: req.url,
    header: req.headers,
    body
  })
  return await fn(req, res)
}

module.exports = {
  handleErrors,
  requireSlackToken,
  requireText,
  logRequests
}
