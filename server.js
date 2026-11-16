// const http = require("http");
// const server = http.createServer((req, res) => {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Hello, World!,");
// });
// server.listen(3000, () => {
//     console.log("Server listening on port 3000");
// });

const config = require("config");
const express = require("express")
const cors = require("cors")
const app = express()
const port = config.get("PORT") || 4000;

const path = require("path");


console.log(config.get("AppName"));
const frontendUrl = config.get("frontendUrl")

app.use(cors(frontendUrl))

//body parser midlewhare
app.use(express.json())

//serving of static asset to the client
app.use("/public", express.static(path.join(__dirname, "public")));



//importing files from routes folder
const error = require("./middleware/error")
const categories = require("./routes/categories")
const product = require("./routes/product")
const book = require("./routes/book")
const user = require("./routes/user")
const profile = require("./routes/profile")
const auth = require("./routes/auth")


//routes middleware
app.use("/categories", categories)
app.use("/product", product)
app.use("/book", book)
app.use("/user", user)
app.use("/profile", profile)
app.use("/auth", auth)

//error middleware
app.use(error)

app.listen(port, () => console.log(`Basic app listening on port ${port}!`))
