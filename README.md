# pantry-list-slack-bot

## Developing Locally

1. Run `yarn dev`, then in another tab, run `yarn ngrok`. Copy the ngrok url to your clipboard. 
2. In the bot settings on Slack, go to 'Event Subscriptions' and change the request url to your ngrok url.
3. When you're done, set the request url back to the latest deployed version. 

## How to deploy

Rename `.env.example` to `.env` and use the value for 'Bot User OAuth Access Token' from the section 'OAuth & Permissions'

```
$ now --dotenv
```
