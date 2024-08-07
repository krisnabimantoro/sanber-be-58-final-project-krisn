import express from "express";
import db from "./utils/database";
import routes from "./route";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
type Person ={
  name:String,
  age:number
}