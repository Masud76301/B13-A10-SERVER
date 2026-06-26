const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express()
const port = 8000

const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = process.env.MONGO_DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const database = client.db(process.env.AUTH_DB_NAME);
        const recipeCollection = database.collection("recipes");

        app.post('/api/recipes', async (req, res) => {
            const recipe = req.body;
            const newRecipe = {
                ...recipe,
                createAt: new Date()
            }
            const result = await recipeCollection.insertOne(newRecipe);
            res.send(result);
        })





        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})