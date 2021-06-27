// Import libraries
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path");
const routes = require("./routes");

// Set port to environmental variable or local port
const PORT = process.env.PORT || 3001;

// Configure app to use Express server
const app = express();

app.use(logger("dev"));

// Add compression for all server requests
app.use(compression());

// Configure app to receive and send JSON objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Expose public directory to client side
app.use(express.static(path.join(__dirname, 'public')));

// Add routes
app.use(routes);

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/workoutdb", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

// Launch application server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});