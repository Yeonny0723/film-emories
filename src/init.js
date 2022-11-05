import "dotenv/config";

import "./db"
import "./models/Video";
import "./models/User";
import "./models/Comment";

import app from "./server"

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`✅ Server listenting on http://localhost:${port} 🚀`);
  })
  