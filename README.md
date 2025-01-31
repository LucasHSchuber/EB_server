# Express-Bild Server
### Lucas H. Schuber
### Software developer / Systemutvecklare


## Express Bild Systems this server contains routes for:
- Svenska Lag
- Job Type Categorizer
- TrustPilot

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
  
