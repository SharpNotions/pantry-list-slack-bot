const { router, post } = require('microrouter')
const { commands, notifications, fulfillment } = require('./handlers')

module.exports = router(
  post('/get-items', commands.getItems),
  post('/get-ranking', commands.getRanking),
  post('/add-item', commands.addItem),
  post('/item-added', notifications.itemAdded),
  post('/events', fulfillment.events),
  post('/dialogflow', fulfillment.dialogflow)
)
