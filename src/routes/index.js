const express = require('express');
const {checkIfValidQueryFields, transformQueryFields} = require('../utils/shared');

const router = express.Router();

router.get('', async (req, res, next) => {
    try {
        const allowedQueryParams = ['name', 'surname', 'vaccine', 'date'];
        const reqQueryParams = Object.keys(req.query);
        await checkIfValidQueryFields(reqQueryParams, allowedQueryParams);
        await transformQueryFields(req.query);

        res.render('index', {...req.query})
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
})

module.exports = router;