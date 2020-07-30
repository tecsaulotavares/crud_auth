const dotenv = require("dotenv");
dotenv.config();

const { PORT } = process.env;

const App = require("./app/");

App.listen(PORT, () => console.log("Server On"));
