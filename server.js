// MAIN SERVER 
import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from 'body-parser';

// import dbConfig
import dbConfig from "./dbConfig.js";


const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
  console.log('Ready to use...');
  connection.release(); 
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// WELCOME ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to this API for Express-Bild")
})




// ---------------------- JOB TYPE KATEGORISERING ----------------------


// GET - all data from "neo_jobtypes_categories"
app.get('/api/jobtypesandcategories', (req, res) => {
    const { portaluuid } = req.query;
    console.log("Retrieved orderuuid: ", portaluuid);

    if (!portaluuid) {
        return res.status(400).json({ error: 'portaluuid is required.' });
    }

    const getData = `
    SELECT 
        j.jobtype_uuid,
        j.portaluuid,
        j.category_id,
        c.name AS category_name
    FROM
        neo_jobtypes j
    LEFT JOIN
        neo_jobtypes_categories c ON j.category_id = c.id
    WHERE 
        j.portaluuid = ? AND c.is_deleted = 0;
    `;

    db.query(getData, [portaluuid], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while getting data.', message: "Error", statuscode: 500, updated: portaluuid });
        }
        const currentTime = new Date().toLocaleTimeString();
        res.status(200).json({ data: results, statuscode: 200, message: 'OK'});
      });
})

// GET - all data from "neo_jobtypes_categories"
app.get('/api/neo_jobtypes_categories', (req, res) => {
    const { portaluuid } = req.query;
    console.log("Retrieved orderuuid: ", portaluuid);

    if (!portaluuid) {
        return res.status(400).json({ error: 'portaluuid is required.' });
    }

    const getJobtypesCategories = `
        SELECT * FROM neo_jobtypes_categories WHERE portaluuid = ? AND is_deleted = 0;
    `

    db.query(getJobtypesCategories, [portaluuid], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while getting data in neo_jobtypes_categories.', message: "Error", statuscode: 500, updated: portaluuid });
        }
        const currentTime = new Date().toLocaleTimeString();
        res.status(200).json({ data: results, statuscode: 200, message: 'OK'});
      });
})

// POST - add tupple in "neo_jobtypes"
app.post('/api/post/neo_jobtypes', (req, res) => {
    const { portaluuid, category_id, jobtype_uuid } = req.body;
    console.log("Retrieved orderuuid: ", portaluuid);

    if (!portaluuid || !category_id || !jobtype_uuid) {
        return res.status(400).json({ error: 'Missing required data for api/post/neo_jobtypes route.' });
    }

    const insertQuery = `
        INSERT INTO neo_jobtypes (portaluuid, category_id, jobtype_uuid) VALUES (?, ?, ?)    
    `;

    db.query(insertQuery, [portaluuid, category_id, jobtype_uuid], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while adding data in neo_jobtypes.', message: "Error", statuscode: 500, jobtype_uuid: jobtype_uuid });
        }
        res.status(201).json({ data: results, jobtype_uuid: jobtype_uuid, statuscode: 201, message: 'OK'});
      });
})


// DELETE - delete tupple in "neo_jobtypes"
app.delete('/api/delete/neo_jobtypes', (req, res) => {
    const { category_id, jobtype_uuid } = req.query;

    if (!category_id || !jobtype_uuid) {
        return res.status(400).json({ error: 'Missing required data for api/delete/neo_jobtypes route.' });
    }

    const deleteQuery = `
        DELETE FROM neo_jobtypes WHERE jobtype_uuid = ? AND category_id = ?   
    `;

    db.query(deleteQuery, [jobtype_uuid, category_id], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while delete row in neo_jobtypes.', message: "Error", statuscode: 500, jobtype_uuid: jobtype_uuid });
        }
        res.status(200).json({ data: results, jobtype_uuid: jobtype_uuid, statuscode: 200, message: 'OK'});
      });
})


// POST - add tupple in "neo_jobtypes_categories"
app.post('/api/post/neo_jobtypes_categories', (req, res) => {
    const { portaluuid, name } = req.body;
    console.log("Retrieved orderuuid: ", portaluuid);

    if (!portaluuid || !name) {
        return res.status(400).json({ error: 'Missing required data for api/post/neo_jobtypes_categories route.' });
    }

    const insertQuery = `
        INSERT INTO neo_jobtypes_categories (portaluuid, name) VALUES (?, ?)    
    `;

    db.query(insertQuery, [portaluuid, name], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while adding data in neo_jobtypes_categories.', message: "Error", statuscode: 500, data: results });
        }
        res.status(201).json({ data: results, portaluuid: portaluuid, statuscode: 201, message: 'OK'});
      });
})


// PUT - update tuple in "neo_jobtypes_categories"
app.put('/api/put/neo_jobtypes_categories', (req, res) => {
    const { id, portaluuid, name } = req.body;
    console.log("Retrieved category_id: ", id);

    // Check for missing required data
    if (!portaluuid || !id || !name) {
        return res.status(400).json({ error: 'Missing required data for api/put/neo_jobtypes_categories route.' });
    }
    const updateQuery = `
        UPDATE neo_jobtypes_categories 
        SET name = ?
        WHERE id = ? AND portaluuid = ?
    `;

    db.query(updateQuery, [name, id, portaluuid], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating data in neo_jobtypes_categories.', message: "Error", statuscode: 500, data: results });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found or no changes made.' });
        }
        res.status(200).json({ data: results, id: id, statuscode: 200, message: 'Category updated successfully.' });
    });
});


// DELETE - delete tupple in "neo_jobtypes_categories"
app.delete('/api/delete/neo_jobtypes_categories', (req, res) => {
    const { id, portaluuid } = req.query;

    if (!id || !portaluuid) {
        return res.status(400).json({ error: 'Missing required data for api/delete/neo_jobtypes_categories route.' });
    }

    const deleteQuery = `
        UPDATE neo_jobtypes_categories SET is_deleted = 1 WHERE id = ? AND portaluuid = ?
    `;

    db.query(deleteQuery, [id, portaluuid], (error, results) => {
        if (error) {
          console.error('SQL error:', error);
          return res.status(500).json({ error: 'An error occurred while delete row in neo_jobtypes.', message: "Error", statuscode: 500, category_id: id });
        }
        res.status(200).json({ data: results, category_id: id, statuscode: 200, message: 'OK'});
      });
})






// ---------------------- SVENSKA SPEL ----------------------







// ---------------------- XXX ----------------------







// ---------------------- YYY ----------------------