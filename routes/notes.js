const notes = require('express').Router();
const fs = require('fs');
const uniqid = require('uniqid');
const notesDB = "./db/db.json";

notes.get('/', (req, res) => {
    fs.readFile(notesDB, 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            res.json(JSON.parse(data));
        }
    });
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uniqid(),
        };

        fs.readFile(notesDB, 'utf8', (error, data) => {
            if (error) {
                console.error(error);
            }
            else {
                const parsedData = JSON.parse(data);
                parsedData.push(newNote);

                fs.writeFile(notesDB, JSON.stringify(parsedData, null, 4), (error) => {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.info(`\nNote ${JSON.stringify(newNote)} written to ${notesDB}`);
                    }
                });
            }
        });
        res.json(`Note added successfully 🚀`);
    }
    else {
        res.error('Error in adding note');
    }
});

notes.delete('/:id', (req, res) => {
    fs.readFile(notesDB, 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        } else {
            const parsedData = JSON.parse(data);
            for (i in parsedData) {
                if (parsedData[i].id == req.params.id) {
                    parsedData.splice(i, 1);
                }
            }
            fs.writeFile(notesDB, JSON.stringify(parsedData, null, 4), (error) => {
                if (error) {
                    console.error(error);
                }
                else {
                    console.info(`\nNote id:"${req.params.id}" removed from ${notesDB}`);
                }
            });
            res.json(`Note ${req.params.id} removed successfully 🚀`);
        }
    });
});

module.exports = notes;
