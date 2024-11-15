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


// GET - data from "neo_jobtypes" and "neo_jobtypes_categories"
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







// ---------------------- SVENSKA LAG ----------------------


// GET - all data from with join
app.get('/api/get/svenskalag/data', (req, res) => {
    const query = `
       SELECT 
            p.uuid, 
            p.name, 
            p.jobtype_uuid, 
            MAX(a.start) AS last_activity, 
            t.*
        FROM 
            neo_projects AS p
        JOIN 
            neo_activities AS a ON p.uuid = a.project_uuid
        LEFT JOIN 
            sl_projects AS t ON p.uuid = t.project_uuid 
        WHERE 
            p.lowest_status = 13 
        GROUP BY 
            p.uuid;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ 
                error: 'An error occurred while retrieving data.', 
                message: "Error", 
                statuscode: 500
            });
        }
        res.status(200).json({ data: results, statuscode: 200, message: 'OK' });
    });
});


// GET - data from "neo_jobtypes" and "neo_jobtypes_categories" where ..... from swedish portal and is_deleted = 0
app.get('/api/get/svenskalag/datainsvenskalagcategory', (req, res) => {
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
    JOIN
        neo_jobtypes_categories c ON j.category_id = c.id
    WHERE 
        j.portaluuid = "2dba368b-6205-11e1-b101-0025901d40ea"
        AND LOWER(c.name) = LOWER("svenska lag")
        AND c.is_deleted = 0;  
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


// PUT - update in_progress_date, in_progress_user, done_date and done_user in "sl_projects" in db
app.put('/api/put/setnone', (req, res) => {
    const { project_uuid, username, portaluuid } = req.body;
    console.log("Retrieved project_uuid: ", project_uuid);
    console.log(req.body);
    // Check for missing required data
    if (!project_uuid || !username) {
        return res.status(400).json({ error: 'Missing required data for /api/put/setnone route.' });
    }
    const upsertQuery = `
        INSERT INTO sl_projects (project_uuid, in_progress_date, in_progress_user, done_date, done_user)
        VALUES (?, NULL, NULL, NULL, NULL)
        ON DUPLICATE KEY UPDATE 
            in_progress_date = NULL,
            in_progress_user = NULL,
            done_date = NULL,
            done_user = NULL
    `;

    db.query(upsertQuery, [project_uuid], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating data in sl_projects.', message: "Error", statuscode: 500, data: results });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found or no changes made.' });
        }
        res.status(200).json({ data: results, project_uuid: project_uuid, statuscode: 200, message: 'Project updated successfully.' });
    });
});

// PUT - update in_progress_date and in_progress_user in "sl_projects" in db
app.put('/api/put/setinprogress', (req, res) => {
    const { project_uuid, username, portaluuid } = req.body;
    console.log("Retrieved project_uuid: ", project_uuid);
    console.log(req.body);
    // Check for missing required data
    if (!project_uuid || !username) {
        return res.status(400).json({ error: 'Missing required data for /api/put/setinprogress route.' });
    }
    const upsertQuery = `
        INSERT INTO sl_projects (project_uuid, in_progress_date, in_progress_user)
        VALUES (?, NOW(), ?)
        ON DUPLICATE KEY UPDATE 
            in_progress_date = NOW(),
            in_progress_user = VALUES(in_progress_user)
    `;

    db.query(upsertQuery, [project_uuid, username], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating data in sl_projects.', message: "Error", statuscode: 500, data: results });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found or no changes made.' });
        }
        res.status(200).json({ data: results, project_uuid: project_uuid, statuscode: 200, message: 'Project updated successfully.' });
    });
});

// PUT - update done_date and done_user in "sl_projects" in db
app.put('/api/put/setdone', (req, res) => {
    const { project_uuid, username } = req.body;
    console.log("Retrieved project_uuid: ", project_uuid);

    // Check for missing required data
    if (!project_uuid || !username) {
        return res.status(400).json({ error: 'Missing required data for /api/put/setdone route.' });
    }
    const upsertQuery = `
        INSERT INTO sl_projects (project_uuid, done_date, done_user)
        VALUES (?, NOW(), ?)
        ON DUPLICATE KEY UPDATE 
            done_date = NOW(),
            done_user = VALUES(done_user)
    `;

    db.query(upsertQuery, [project_uuid, username], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating data in sl_projects.', message: "Error", statuscode: 500, data: results });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found or no changes made.' });
        }
        res.status(200).json({ data: results, project_uuid: project_uuid, statuscode: 200, message: 'Project updated successfully.' });
    });
});

// PUT - update notes "sl_projects" in db
app.put('/api/put/notessvenskalag', (req, res) => {
    const { project_uuid, notes } = req.body;
    console.log("Retrieved project_uuid: ", project_uuid);

    // Check for missing required data
    if (!project_uuid) {
        return res.status(400).json({ error: 'Missing required data for /api/put/notessvenskalag route.' });
    }
    const upsertQuery = `
        INSERT INTO sl_projects (project_uuid, notes)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE 
        notes = VALUES(notes)
    `;

    db.query(upsertQuery, [project_uuid, notes], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating notes in sl_projects.', message: "Error", statuscode: 500, data: results });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'notes not found or no changes made.' });
        }
        res.status(200).json({ data: results, project_uuid: project_uuid, statuscode: 200, message: 'Notes updated successfully.' });
    });
});


// PUT - update memberslist "sl_projects" in db
app.put('/api/put/checkmemberslist', (req, res) => {
    const { project_uuid, status } = req.body;
    console.log("Retrieved project_uuid: ", project_uuid);
    console.log("status:", status);
    // Check for missing required data
    if (!project_uuid || status === undefined) {
        return res.status(400).json({ error: 'Missing required data for /api/put/checkmemberslist route.' });
    }

    const upsertQuery = `
       INSERT INTO sl_projects (project_uuid, memberslist) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE 
       memberslist = VALUES(memberslist);
    `;

    db.query(upsertQuery, [project_uuid, status], (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ error: 'An error occurred while updating memberslist in sl_projects.', message: "Error", statuscode: 500, data: results });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found or no changes made.' });
        }
        res.status(200).json({ data: results, project_uuid: project_uuid, statuscode: 200, message: 'Memberslist updated successfully.' });
    });
});





// ---------------------- XXX ----------------------










// ---------------------- YYY ----------------------