import "dotenv/config";
import express from "express";

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const TARGET_URL = process.env.TARGET_URL;
const REDIRECT_STATUS = Number(process.env.REDIRECT_STATUS || 301);

if (!TARGET_URL) {
  console.error("Missing TARGET_URL environment variable.");
  process.exit(1);
}

if (![301, 302].includes(REDIRECT_STATUS)) {
  console.error("REDIRECT_STATUS must be 301 or 302.");
  process.exit(1);
}

let redirectBaseUrl;

try {
  redirectBaseUrl = new URL(TARGET_URL);
} catch (error) {
  console.error("TARGET_URL must be a valid absolute URL.");
  process.exit(1);
}

if (!redirectBaseUrl.pathname.endsWith("/")) {
  redirectBaseUrl.pathname = `${redirectBaseUrl.pathname}/`;
}

app.use((req, res) => {
  const requestPath = req.originalUrl.replace(/^\/+/, "");
  const redirectUrl = new URL(requestPath, redirectBaseUrl);

  res.redirect(REDIRECT_STATUS, redirectUrl.toString());
});

app.listen(PORT, () => {
  console.log(`Redirect app listening on port ${PORT}`);
});
