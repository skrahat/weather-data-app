const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3006;

// uri will be stored in the env file for future use
const mongoURI =
  'mongodb+srv://skrahat:skrahat@cluster0.zseseur.mongodb.net/<database-name>?retryWrites=true&w=majority';

const dbName = 'Cluster0';
const collectionName = 'weather_data_forecast';

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(express.json());

app.get('/shortlist', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find().toArray();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
