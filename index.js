
// from https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// from https://github.com/mongodb-developer/nodejs-quickstart

const { MongoClient } = require("mongodb");
const http = require("http");

const uri =
   `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URL}?retryWrites=true&writeConcern=majority`;
// Create a new MongoClient
const client = new MongoClient(uri);

async function listDatabases(client, res){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.write("Databases:\n");
  databasesList.databases.forEach(db => res.write(` - ${db.name}\n`));
};

const host = 'localhost';
const port = 8000;

async function requestListener (req, res) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
    await listDatabases(client,res);
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  }
  res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
   console.log(`Server is running on http://${host}:${port}`);
});

