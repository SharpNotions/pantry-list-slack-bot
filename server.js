const { router, post } = require('microrouter')
const { commands, notifications } = require('./handlers')

module.exports = router(
  post('/get-items', commands.getItems),
  post('/get-ranking', commands.getRanking),
  post('/clear-rankings', commands.clearRankings),
  post('/add-item', commands.addItem),
  post('/item-added', notifications.itemAdded)
)
