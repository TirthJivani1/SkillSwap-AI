const express = require('express');
const router = express.Router();
const {
  getConnections,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  removeConnection
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConnections);
router.post('/request', protect, sendConnectionRequest);
router.put('/:id/accept', protect, acceptConnection);
router.put('/:id/reject', protect, rejectConnection);
router.delete('/:id', protect, removeConnection);

module.exports = router;
