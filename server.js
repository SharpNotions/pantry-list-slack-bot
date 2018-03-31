const { router, post } = require('microrouter')
const { commands, notifications, fulfillment } = require('./handlers')

module.exports = router(
  post('/add-item', commands.addItem),
  post('/item-added', notifications.itemAdded),
  post('/events', fulfillment.events)
)
