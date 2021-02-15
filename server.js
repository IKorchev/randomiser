require("dotenv").config()
const path = require("path")
const express = require("express")
const fetch = require("node-fetch")
const app = express()
const BING_API_KEY = process.env.API_KEY
const PORT = process.env.PORT || 8080
const SEARCH_URL = "https://api.bing.microsoft.com/v7.0/images/search?q="

app.use(express.static(path.join(__dirname, "public")))

app.get("/search/:name", async (req, res) => {
  const fragName = req.params.name
  try {
    const fetch_response = await fetch(SEARCH_URL + fragName, {
      headers: {
        "Ocp-Apim-Subscription-Key": BING_API_KEY,
      },
    })
    const data = await fetch_response.json()
    res.json(data)
  } catch (err) {
    console.log(err)
  }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
