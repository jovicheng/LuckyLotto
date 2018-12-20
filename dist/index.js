const Express = require("express")
const App = Express()
const path = require("path")

App.use("/scripts", Express.static("scripts"))
App.use("/static", Express.static("static"))

App.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./index.html"))
})

App.listen(8083)
