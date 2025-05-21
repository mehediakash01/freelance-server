require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

// Database creation

const uri = `mongodb+srv://${process.env.FREELANCE_MARKET_DB}:${process.env.FREELANCE_MARKET_PASS}@cluster0.jcgtqm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
const dataCollection = client.db("taskDb").collection("tasks");
// store data from addTask
app.post('/addTasks',async(req,res)=>{
    const allTasks = req.body;
    const result = await dataCollection.insertOne(allTasks);
    res.send(result);

})






    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Freelancing task server is running");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
