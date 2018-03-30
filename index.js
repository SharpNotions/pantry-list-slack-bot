const { router, post } = require('microrouter')
const { itemAdded, addItem, events } = require('./handlers')

module.exports = router(
  post('/events', events),
  post('/item-added', itemAdded),
  post('/add-item', addItem)
)
