const Note = require('../model/Note');
const axios = require('axios');
const errorHandler = require("../common/error.module")

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return errorHandler.badRequest(res, 'Title and content are required.');
    }

    const response = await axios.get('https://catfact.ninja/fact');
    const catfact = response?.data?.fact || 'No cat fact available at the moment.';

    const newNote = await Note.create({ title, content, catfact });

    return errorHandler.sendOk(res, 'Note created successfully.', newNote);
  } catch (error) {
    return errorHandler.serviceError(res, 'Failed to create note.', error);
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    if (!notes || notes.length === 0) {
      return errorHandler.notFound(res, 'No notes found.');
    }
    // return errorHandler.sendOk(res, 'Notes retrieved successfully.', notes);
    res.json(notes);
  } catch (error) {
    return errorHandler.serviceError(res, 'Failed to fetch notes.', error);
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return errorHandler.notFound(res, 'Note not found.');
    }

    return errorHandler.sendOk(res, 'Note deleted successfully.', deletedNote);
  } catch (error) {
    return errorHandler.serviceError(res, 'Failed to delete note.', error);
  }
};


exports.searchNotes = async (req, res) => {
  const q = req.query.q?.trim() || '';

  if (!q) {
    return errorHandler.badRequest(res, 'Search query cannot be empty.');
  }

  try {
    const result = await Note.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { catfact: { $regex: q, $options: 'i' } }
      ]
    });

    if (!result.length) {
      return errorHandler.notFound(res, 'No matching notes found.');
    }

    // return errorHandler.sendOk(res, 'Search results found.', result);
    res.json(result);
  } catch (error) {
    return errorHandler.serviceError(res, 'Failed to search notes.', error);
  }
};
