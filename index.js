require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const cron = require("node-cron");
const axios = require("axios");

const TZ = "Asia/Kolkata";
const GF_NUMBER = "919058061623@c.us"; // Replace with GF's WhatsApp ID

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "ai-scheduler-gf" }),
  puppeteer: {
    headless: true,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-gpu",
      "--window-size=1920,1080",
      "--remote-debugging-port=9222",
    ],
  },
});

async function getAIReply(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ✅ Best for creative messages
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ AI API Error:", error.response?.data || error.message);
    return "AI so raha hai 😴 par Good vibes tumhare liye always!";
  }
}

async function sendAIMessage(prompt) {
  const aiMessage = await getAIReply(prompt);
  await client.sendMessage(GF_NUMBER, aiMessage);
  console.log("✅ Sent:", aiMessage);
}

client.on("qr", (qr) => {
  console.log("📱 Scan QR:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp AI Scheduler Ready!");

  // ✅ GOOD MORNING - 06:00
  cron.schedule(
    "50 11 * * *",
    () => {
      sendAIMessage(
        "Good morning message likho Hinglish me, romantic tone, emoji ke sath, daily fresh vibe ke liye. 1 line only cheeku name k sath"
      );
    },
    { timezone: TZ }
  );

  // ✅ BREAKFAST - 07:30
  cron.schedule(
    "55 11 * * *",
    () => {
      sendAIMessage(
        "Care vali vibes me likho hinglish me breakfast kar lena time se cheeku ye message bhejna hai 1 line only ."
      );
    },
    { timezone: TZ }
  );

  // ✅ LUNCH - 13:00
  cron.schedule(
    "0 12 * * *",
    () => {
      sendAIMessage(
        "Care vali vibes me likho hinglish me lunch  kar lena time se cheeku ye message bhejna hai 1 line only ."
      );
    },
    { timezone: TZ }
  );

  // ✅ HOME REACH? - 14:15
  cron.schedule(
    "5 12 * * *",
    () => {
      sendAIMessage(
        "GF se puchho ghar pahunch gayi kya? Cute caring style me likho, Hinglish + emoji. 1 line only"
      );
    },
    { timezone: TZ }
  );

  // ✅ DINNER - 20:00
  cron.schedule(
    "10 12 * * *",
    () => {
      sendAIMessage(
        "Care vali vibes me likho hinglish me dinner  kar lena cheeku  time se ye message bhejna hai 1 line only ."
      );
    },
    { timezone: TZ }
  );

  // ✅ GOOD NIGHT - 22:00
  cron.schedule(
    "8 12 * * *",
    () => {
      sendAIMessage(
        "Good night message likho Hinglish me, pyar bhara, romantic, sweet dreams mention karo, emojis ke sath."
      );
    },
    { timezone: TZ }
  );

  console.log("🗓️ All AI-powered daily jobs scheduled!");
});

client.initialize();
