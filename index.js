require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.FREELANCE_MARKET_DB}:${process.env.FREELANCE_MARKET_PASS}@cluster0.jcgtqm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Explicitly connect client

    const dataCollection = client.db("taskDb").collection("tasks");

    // Create task with timestamp
    app.post("/addTasks", async (req, res) => {
      try {
        const newTask = req.body;
        newTask.createdAt = new Date(); // Add createdAt timestamp
        const result = await dataCollection.insertOne(newTask);
        res.send(result);
      } catch (error) {
        console.error("Add task error:", error);
        res.status(500).send({ error: "Failed to add task" });
      }
    });

    // Get all tasks with search and sort support
    app.get("/allTasks", async (req, res) => {
      try {
        const { search = "", sort = "latest" } = req.query;

        const query = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };

        let sortOption = {};
        if (sort === "budget_asc") {
          sortOption = { budget: 1 };
        } else if (sort === "budget_desc") {
          sortOption = { budget: -1 };
        } else {
          sortOption = { createdAt: -1 };
        }

        const tasks = await dataCollection
          .find(query)
          .sort(sortOption)
          .toArray();
        res.send(tasks);
      } catch (error) {
        console.error("Fetch allTasks error:", error);
        res.status(500).send({ error: "Failed to fetch tasks" });
      }
    });

    // Get tasks by user email
    app.get("/myTasks/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;
        const query = { email: userEmail };
        const result = await dataCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Fetch myTasks error:", error);
        res.status(500).send({ error: "Failed to fetch user tasks" });
      }
    });

    // Get featured tasks by closest deadline
    app.get("/featuredTask", async (req, res) => {
      try {
        const allTasks = await dataCollection.find().toArray();

        const sortedTasks = allTasks
          .filter((task) => task.date)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6);

        res.send(sortedTasks);
      } catch (error) {
        console.error("Fetch featuredTask error:", error);
        res.status(500).send({ error: "Failed to fetch featured tasks" });
      }
    });

    // Update bid count only
    app.patch("/taskDetails/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { bid } = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = { $set: { bid: (bid) } };
        const result = await dataCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Update bid error:", error);
        res.status(500).send({ error: "Failed to update bid" });
      }
    });

    // Update entire task
    app.patch("/taskUpdate/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTask = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedTask };
        const result = await dataCollection.updateOne(query, updateDoc);
       

        res.send(result);
      } catch (error) {
        console.error("Update task error:", error);
        res.status(500).send({ error: "Failed to update task" });
      }
    });

    // Delete a task
    app.delete("/deleteTask/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await dataCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).send({ error: "Failed to delete task" });
      }
    });

    // You can add other routes here...
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

run().catch(console.dir);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Freelancing task server is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
