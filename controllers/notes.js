const express = require('express')
const moong = require('mongoose')
router = express.Router()

const Note = require('../models/Note');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    console.log(req.body)
  const { title, content } = req.body; 
  if (!title || !content) {
    return res.status(400).json({ message: 'Please provide title and content' });
  }

  const newNote = new Note({ title, content });
  try {
    const savedNote = await newNote.save();
    res.status(201).json({status:"201",id:savedNote._id,message:"Notes Created"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!moong.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({status:200,data:{title:note.title,content:note.content,createdAt:note.createdAt},messae:"data Retrieved"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!moong.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const update = { title, content };

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, update, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({status:204,data:{title:updatedNote.title,content:updatedNote.content,createdAt:updatedNote.createdAt},messae:"Data Updated"});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!moong.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


