const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('User router');
});

module.exports = router;