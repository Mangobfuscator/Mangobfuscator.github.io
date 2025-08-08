const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { code, token } = req.body;

  if (!code || !token) {
    return res.status(400).json({ error: "Missing code or CAPTCHA token." });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const verifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const formData = new URLSearchParams();
  formData.append("secret", secretKey);
  formData.append("response", token);

  const verifyRes = await fetch(verifyURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  });

  const data = await verifyRes.json();
  if (!data.success) {
    return res.status(403).json({ error: "CAPTCHA verification failed." });
  }

  const obfuscated = `-- Obfuscated --\n${code.split('').reverse().join('')}`;
  res.status(200).json({ obfuscated });
};