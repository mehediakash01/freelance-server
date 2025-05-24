require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    app.post("/addTasks", async (req, res) => {
      const allTasks = req.body;

      const result = await dataCollection.insertOne(allTasks);
      res.send(result);
    });

    // get data from the db
    app.get("/allTasks", async (req, res) => {
      const result = await dataCollection.find().toArray();
      res.send(result);
    });
    // get specific data from the db
    app.get(`/taskDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    // get user added task from db
    app.get(`/myTasks/:email`, async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };
      const result = await dataCollection.find(query).toArray();
      res.send(result);
    });

    // get data according deadline
  app.get('/featuredTask', async (req, res) => {
  const allTasks = await dataCollection.find().toArray();

  const sortedTasks = allTasks
    .filter(task => task.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) 
    .slice(0, 6);

  res.send(sortedTasks);
});


    // update bid count and store it into db
app.patch("/taskDetails/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
const {bid} = req.body;
  


  const updateDoc = {
    $set:{ bid: Number(bid)}
  };

  const result = await dataCollection.updateOne(query, updateDoc);
  res.send(result);
});



    // delete user task
    app.delete("/deleteTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      res.send(result);
    });
    // update user added task
    app.patch(`/taskDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updatedTask = req.body;
      const updateDoc = {
        $set: updatedTask,
      };
      const result = await dataCollection.updateOne(query, updateDoc);
      res.send(result);
    });

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
