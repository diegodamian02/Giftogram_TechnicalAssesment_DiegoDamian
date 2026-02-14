// Initial commit to see if packages are workingh correctly
const express = require("express")

const app = express()
app.use(express.json)

app.get("/health", (req, res) => {
    res.json({ ok: true});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`))