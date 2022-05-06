const { Client, Intents } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("Bot is online  ◔_◔ ");
  // gets the channel the bot is gonna post in
  client.channels.cache
    .get(process.env.CHANNEL_ID)
    .send(`Booting up! (* ^ ω ^)`);

  console.log("Fetching started (=^ ◡ ^=)");
  let lastSold = 0;

  // the initial fetch to know the last sold nft

  const initialFetch = async () => {
    const smartContract = process.env.CONTRACT;
    const url = `https://api.opensea.io/api/v1/events?asset_contract_address=${smartContract}&event_type=successful&only_opensea=false&limit=1`;
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.OS_API,
      },
    });
    const data = response.data;
    const processAPI = data.asset_events[0];
    const tokenID = processAPI.asset.token_id; // token id

    lastSold = tokenID;
  };

  initialFetch();

  // loop function that keeps fetching for new nft sales

  const loopSaleFunction = async () => {
    const smartContract = process.env.CONTRACT;
    const url = `https://api.opensea.io/api/v1/events?asset_contract_address=${smartContract}&event_type=successful&only_opensea=false&limit=1`;
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.OS_API,
      },
    });

    // =====================================================
    const data = response.data;
    const processAPI = data.asset_events[0];
    const newSale = processAPI.asset.token_id; // token id
    const nftImage = processAPI.asset.image_url; // image
    const currentOwner = processAPI.asset.owner.address; // current owner
    const previousOwner = processAPI.seller.address; // previous owner
    const transactionTime = processAPI.transaction.timestamp; // transaction time
    const salePrice = processAPI.total_price; // Total price in ETH
    const salePriceETH = salePrice * 0.000000000000000001;
    ///  convert to usd
    const usd_price = processAPI.payment_token.usd_price; //  price of 1 ETH in USD
    const conversionToUSD = salePriceETH * usd_price; // price of the nft in USD
    const conversionStyle = conversionToUSD.toFixed(1);
    const salePriceUSD = parseFloat(conversionStyle).toLocaleString("en", {
      style: "currency",
      currency: "USD",
    });

    const transactionTimeProccess = transactionTime.split("T");
    const saleDate = transactionTimeProccess[0];
    const saleTime = transactionTimeProccess[1];

    // processing fetched data
    if (lastSold === newSale) {
      // if the last sale is the same as the new sale, do nothing
    } else {
      lastSold = newSale;
      client.channels.cache.get(process.env.CHANNEL_ID).send({
        // discord embed style
        embeds: [
          {
            type: "rich",
            title: `Latest sale #${newSale} `,
            description: "",
            url: `https://opensea.io/assets/${smartContract}/${newSale}`,
            fields: [
              {
                name: `price: `,
                value: `${salePriceETH}Ξ (${salePriceUSD})`,
              },
              {
                name: `Buyer:`,
                value: `${currentOwner}`,
              },
              {
                name: `Seller:`,
                value: `${previousOwner}`,
              },
            ],
            image: {
              url: `${nftImage}`,
              height: 0,
              width: 0,
            },
            footer: {
              text: `Sale time: ${saleTime} (UTC) - ${saleDate}`,
            },
          },
        ],
      });
    }
  };
  // run the loop function every 10 seconds (set in env file)

  setInterval(loopSaleFunction, process.env.INTERVAL);
});

// extra misc commands
client.on("messageCreate", (message) => {
  if (message.content.startsWith("ping")) {
    console.log("pong");
  } else if (message.content === "shutdown") {
    console.log("Shutting down (μ_μ)");
  }
});

client.login(process.env.BOT_TOKEN);
