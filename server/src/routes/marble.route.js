const express = require('express');
const Marble = require('../models/Marble');
const upload = require('../utils/multer');

const router = express.Router();

// Middleware to validate marble ID
const validateMarbleId = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Marble ID.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server Error.' });
  }
};

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, finishes } = req.body;

    // Validate input
    if (!name || !finishes) {
      return res.status(400).json({ error: 'Name and finishes are required.' });
    }

    // Validate finishes as an array
    if (!Array.isArray(finishes) || finishes.length === 0) {
      return res.status(400).json({ error: 'At least one finish is required.' });
    }

    // Map uploaded files to finishes
    const uploadedFiles = req.files || [];
    const updatedFinishes = finishes.map((finish, index) => ({
      ...finish,
      link: uploadedFiles[index] ? uploadedFiles[index].location : finish.link,
    }));

    // Create and save the marble
    const marble = new Marble({
      name,
      description,
      finishes: updatedFinishes,
    });

    await marble.save();
    res.status(201).json(marble);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create Marble.', details: err.message });
  }
});
  

router.get('/', async (req, res) => {
  try {
    const marbles = await Marble.find();
    res.status(200).json(marbles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Marbles.' });
  }
});

router.get('/:id', validateMarbleId, async (req, res) => {
  try {
    const marble = await Marble.findById(req.params.id);
    if (!marble) return res.status(404).json({ error: 'Marble not found.' });

    res.status(200).json(marble);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Marble.' });
  }
});

router.put('/:id', validateMarbleId, async (req, res) => {
  try {
    const { name, description, finishes } = req.body;

    const updatedMarble = await Marble.findByIdAndUpdate(
      req.params.id,
      { name, description, finishes },
      { new: true, runValidators: true },
    );

    if (!updatedMarble) return res.status(404).json({ error: 'Marble not found.' });

    res.status(200).json(updatedMarble);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Marble.', details: err.message });
  }
});

router.delete('/:id', validateMarbleId, async (req, res) => {
  try {
    const marble = await Marble.findByIdAndDelete(req.params.id);
    if (!marble) return res.status(404).json({ error: 'Marble not found.' });

    res.status(200).json({ message: 'Marble deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Marble.' });
  }
});

module.exports = router;
