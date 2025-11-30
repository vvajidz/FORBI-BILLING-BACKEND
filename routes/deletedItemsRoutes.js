const express = require('express');
const router = express.Router();
const deletedItemsController = require('../controllers/deletedItemsController');

router.get('/', deletedItemsController.getAllDeleted);
router.put('/:model/:id/restore', deletedItemsController.restoreItem);
router.delete('/:model/:id', deletedItemsController.permanentDelete);

module.exports = router;
