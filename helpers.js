const { WebClient } = require('@slack/client')

const getUserEmail = async (slackUserId) => {
  const web = new WebClient(process.env.SLACK_TOKEN)
  const userDetails = await web.users.info({user: slackUserId})
  return userDetails.user.profile.email;
}

exports.getUserEmail = getUserEmail;
