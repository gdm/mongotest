
// from https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// from https://github.com/mongodb-developer/nodejs-quickstart

const { MongoClient } = require("mongodb");
const http = require("http");
const winston = require('winston');

// logging part was taken from https://www.section.io/engineering-education/logging-with-winston/
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            level: 'info',
            filename: '/var/log/nodeapp/application.log'
        })
    ],
		format: winston.format.combine(
        winston.format.label({
            label: `Label🏷️`
        }),
        winston.format.timestamp({
           format: 'YYYY-MM-DD HH:mm:ss'
       }),
        winston.format.printf(info => `${[info.timestamp]} ${info.level}: ${info.label}: ${info.message}`),
    )
};

const logger = winston.createLogger(logConfiguration);

const uri = process.env.MONGODB_URL;

// Create a new MongoClient
const client = new MongoClient(uri);

async function listDatabases(client, res){
  databasesList = await client.db().admin().listDatabases();

  let plain_line = "Databases: ";
  databasesList.databases.forEach(db => plain_line += ` ${db.name}`);
  logger.info(plain_line);

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.write("Databases:\n");
  databasesList.databases.forEach(db => res.write(` - ${db.name}\n`));
};

const host = '0.0.0.0';
const port = 8000;

async function requestListener (req, res) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    logger.info("Connected successfully to server");
    await listDatabases(client,res);
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  }
  res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
   logger.info(`Server is running on http://${host}:${port}`);
});


