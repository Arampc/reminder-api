const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        text: body
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      throw new Error("Resend error");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};