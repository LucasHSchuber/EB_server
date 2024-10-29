# Express-Bild Main Server

This repository contains the primary server for the projects at **Express-Bild**. It is built using Node.js and Express, with a MySQL database for data storage, and includes configuration for CORS and body parsing.

## API Routes
- GET "/" 

## Getting Started
Ensure that you have the following installed:

- Node.js
- MySQL

### Installation
1. Clone this repository:
   git clone https://github.com/LucasHSchuber/EB_server.git
   cd EB_server
2. Run 'npm install'
3. Run 'node server.js' to start the server


### Important Files
- Make sure to have dbConfig.js located in root, containing necessary database config settings:

// dbConfig.js
const dbConfig = {
    connectionLimit: 10,
    host: "",
    user: "",
    password: "",
    database: "",
    port: ,
  };
  export default dbConfig;
  
