require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

console.log("BOT STARTED");

// ---------------- WEB SERVER ----------------
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server started");
});

// ---------------- BOT ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ---------------- SETTINGS ----------------
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const ROLE_ID = "1490119562853617795";

const IMAGE_URL =
  "https://th.bing.com/th/id/OIP.1vPuKW06mnXzD7W--g2bVwHaHa?w=185&h=185&c=7&r=0&o=5&pid=1.7";

// ---------------- READY ----------------
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ---------------- ROLE ADDED / REMOVED ----------------
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  try {
    const hadRole = oldMember.roles.cache.has(ROLE_ID);
    const hasRole = newMember.roles.cache.has(ROLE_ID);

    // 🟢 ROLE ADDED
    if (!hadRole && hasRole) {
      console.log("ROLE ADDED");

      await axios.post(WEBHOOK_URL, {
        username: "Anarchy Command",
        embeds: [
          {
            title: "🟢 RECRUIT ENLISTED",
            description:
              "**NEW ENLISTMENT CONFIRMED**\n\n" +
              "👤 Soldier: <@" + newMember.id + ">\n" +
              "📥 Status: Active Recruit\n\n" +
              "**Welcome to the ranks. Discipline is strength.**",
            color: 0x57f287,
            image: { url: IMAGE_URL }
          }
        ]
      });
    }

    // 🔴 ROLE REMOVED
    if (hadRole && !hasRole) {
      console.log("ROLE REMOVED");

      await axios.post(WEBHOOK_URL, {
        username: "Anarchy Command",
        embeds: [
          {
            title: `${newMember.user.username} - DISCHARGED`,
            description:
              "**PERSONNEL STATUS UPDATE**\n\n" +
              "👤 Soldier: <@" + newMember.id + ">\n" +
              "📤 Status: Removed from active service\n\n" +
              "**The unit continues forward.**",
            color: 0xed4245,
            image: { url: IMAGE_URL }
          }
        ]
      });
    }

  } catch (err) {
    console.error("Role update error:", err);
  }
});

// ---------------- LOGIN ----------------
client.login(process.env.DISCORD_TOKEN);
