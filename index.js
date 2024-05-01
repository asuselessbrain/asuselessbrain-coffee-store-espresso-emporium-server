const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.user_Name}:${process.env.password}@cluster0.x6ipdw6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// const database = client.db("coffeeHouseDB").collection("");

async function run() {


    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db("coffeeHouseDB").collection("coffee");

        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find()

            const result = await cursor.toArray();

            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {

            const id = req.params.id;

            const query = {_id: new ObjectId(id)};


            const result = await coffeeCollection.findOne(query);

            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {

            const id = req.params.id
            const query = {_id: new ObjectId(id)};

            const result = await coffeeCollection.deleteOne(query);

            res.send(result)
        })

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })


        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


