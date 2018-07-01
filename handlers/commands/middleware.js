const { send } = require('micro')

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
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

module.exports = {
  handleErrors
}
