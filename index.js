const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3nkfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


	// CREATE: send user input data from server to database. client: Add Book
	const AllBookCollection = client.db("BookSharing").collection("AllBooks");
	app.post('/addBooks', async(req,res) => {
		const newBook = req.body;
		console.log(newBook);
		const result = await AllBookCollection.insertOne(newBook);
		res.send(result);
	})
	// READ: get data from db. client: All Books
    app.get('/allBooks', async(req,res) => {
		const cursor = AllBookCollection.find();
		const result = await cursor.toArray();
		res.send(result);
	})
	// load before update
	app.get('/allBooks/:id', async(req,res) => {
		const id = req.params.id;
		const query = {_id : new ObjectId(id)}
		const result = await AllBookCollection.findOne(query);
		res.send(result);
	 })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
	res.send('Library Hub server is running')
})
app.listen(port, () => {
	console.log(`Library Hub is running on port ${port}`)
})

