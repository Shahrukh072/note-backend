const express = require('express');
const router = express.Router();
const {
  createNote, getAllNotes, deleteNote, searchNotes
} = require('../controller/notesController');

router.post('/addNotes', createNote);
router.get('/getAllNotes', getAllNotes);
router.delete('/:id', deleteNote);
router.get('/search', searchNotes);

module.exports = router;
