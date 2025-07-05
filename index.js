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
		// GET: Fetch all or filtered parcels
		app.get("/parcels", async (req, res) => {
			// Get query params
			const {
				sort,
				booked_by,
				delivery_status,
				parcel_type,
				payment_status,
				sender_region,
				receiver_region,
			} = req.query;
			// Initialize empty `query` and `options`
			const query = {};
			const options = {};
			// Filter documents
			booked_by ? (query.booked_by = booked_by) : query;
			parcel_type ? (query["parcel.type"] = parcel_type) : query;
			delivery_status ? (query["delivery.status"] = delivery_status) : query;
			payment_status ? (query["payment.status"] = payment_status) : query;
			sender_region ? (query["sender.region"] = sender_region) : query;
			receiver_region ? (query["receiver.region"] = receiver_region) : query;
			// Sort documents
			if (sort === "created_at") options.sort = { booked_at: -1 };
			// Send result documents
			const result = await parcelsColl.find(query, options).toArray();
			res.send(result);
		});
		// POST: Create a parcel
		app.post("/parcels", async (req, res) => {
			const newParcel = req.body;
			const result = await parcelsColl.insertOne(newParcel);
			res.status(201).send(result);
		});
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
