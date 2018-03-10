# pantry-list-slack-bot

## Developing Locally

1. Run `yarn dev`, then in another tab, run `yarn ngrok`. Copy the ngrok url to your clipboard. 
2. In the bot settings on Slack, go to 'Event Subscriptions' and change the request url to your ngrok url.

## How to deploy

Rename `.env.example` to `.env` and use the value for 'Bot User OAuth Access Token' from the section 'OAuth & Permissions'

```
$ now --dotenv
```
