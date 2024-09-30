export default async function WebsiteStatus(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const response = await fetch(url);

    if (response.ok) {
      res.status(200).json({ status: "up" });
    } else {
      res.status(500).json({ status: "down", error: `Failed to fetch ${url}` });
    }
  } catch (error) {
    res.status(500).json({ status: "down", error: error.message });
  }
}
