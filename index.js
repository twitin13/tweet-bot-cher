import fs from "fs";
import { TwitterApi } from "twitter-api-v2";

// === X CLIENT ===
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});
const rwClient = client.readWrite;

async function main() {
  try {
    // baca caption
    const captions = JSON.parse(fs.readFileSync("./captions.json", "utf8"));

    // baca gambar
    const images = fs
      .readdirSync("./images")
      .filter(f => f.match(/\.(jpg|jpeg|png)$/i));

    if (images.length === 0) {
      throw new Error("Folder images kosong");
    }

    // pilih random
    const image = images[Math.floor(Math.random() * images.length)];
    const caption = captions[image] || "";

    const mediaId = await rwClient.v1.uploadMedia(`./images/${image}`);

    await rwClient.v2.tweet({
      text: caption,
      media: { media_ids: [mediaId] },
    });

    console.log("✅ Tweet terkirim:", image);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
