const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
// uri will be stored in the env file for future use
const uri =
  'mongodb+srv://skrahat:skrahat@cluster0.zseseur.mongodb.net/<database-name>?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function fetchData() {
  try {
    const response = await axios.get(
      'https://weatherapi.pelmorex.com/v1/observation?lat=43.5100092&long=-79.8976626'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const db = client.db('Cluster0');
    const collection = db.collection('weather_data');

    const fetchInterval = 30000;

    setInterval(async () => {
      try {
        const data = await fetchData();
        const timestamp = Date.now();

        // Insert the fetched data into the MongoDB collection
        await collection.insertOne({ timestamp, data });

        console.log('Data saved to MongoDB:', data);
      } catch (error) {
        console.error('Error fetching or saving data:', error);
      }
    }, fetchInterval);
  } catch (error) {
    console.error('Error in run:', error);
  } finally {
    // Do not close the connection here; keep it open for the interval
  }
}

run().catch(console.dir);
