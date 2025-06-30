// Import SDKs
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config;
const app = express();
const port = process.env.PORT || 5100;
dotenv();

// Middlewares
app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:5173"],
	}),
);

// MongoDB Atlas URI
const db_uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@professorcluster.rlegbqz.mongodb.net/?retryWrites=true&w=majority&appName=ProfessorCluster`;

// MongoDB Client
const db_client = new MongoClient(db_uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

// MongoDB & API run function
const run_server = async () => {
	try {
		// Client connection with server (turn off in deployment)
		await db_client.connect();
		// Define database
		const db = db_client.db("zapshift");
		// Define collections
		const parcelsColl = db.collection("parcels");
		// Ping for successful connection confirmation
		await db_client.db("admin").command({ ping: 1 });
		console.log("Pinged. Successfully connected to MongoDB!");
	} finally {
		// Don't close client connection with server
		// await client.close();
	}
};
run_server().catch(console.dir);

// Home route response
app.get("/", (req, res) => {
	res.send(
		'<h1 style="text-align: center; font-family: sans-serif;">ZapShift Server is shifting at Zap-speed!</h1>',
	);
});

// Log the port where the server is running
app.listen(port, () => {
	console.log(`ZapShift Server is running on Port ${port}`);
});
