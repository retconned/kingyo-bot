# 🤖 Kingyo NFT Discord Bot

## **What is Kingyo ?**

Kingyo is a NFT discord bot that showcases latest nft sale from a targetted collection/smart contract using the OpenSea API.

# Screenshot

![screenshot of the Kingyo discord bot](https://i.imgur.com/Qvynl6N.png)

# Installation

1. Clone the repo

   ```sh
   git clone https://github.com/retconned/kingyo-bot
   ```

2. Change directory to the project folder

   ```sh
   cd kingyo-bot
   ```

3. Edit the `template.env` to `.env` and add your tokens & API Keys, request your opensea API key [Here](https://docs.opensea.io/reference/request-an-api-key)

   ```sh
    BOT_TOKEN=Your-Discord-Bot-token

    OS_API=Your-OpenSea-Api-Token

    CONTRACT=Your-Collection-Smart-Contract-Address

    CHANNEL_ID=Discord-channel-ID-that-sales-will-be-posted-into
   ```

4. Run the app locally

   ```sh
   yarn dev
   ```

5. Build the docker image

   ```sh
   docker build . -t kingyo-bot
   ```
