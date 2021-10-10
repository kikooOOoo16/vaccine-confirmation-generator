const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('patients/index');
})

module.exports = router;