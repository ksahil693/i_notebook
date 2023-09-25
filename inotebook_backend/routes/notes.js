const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route-1--------------------------------- Get all the notes using : Get "/api/notes/fetchallnotes". login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route-2--------------------------------- add a new Note using : POST "/api/notes/addnote". login required

router.post(
  "/addnote",

  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 6 characters").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If their are errors, return bad request and that error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // saving the note into database
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savednote = await note.save();

      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route-3--------------------------------- update an existing note using : Put "/api/notes/updatenote". login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route-4--------------------------------- Delete an existing note using : Delete "/api/notes/deletenote". login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //Checking if user is the owner of note oe not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    //Deleting the note from database
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
