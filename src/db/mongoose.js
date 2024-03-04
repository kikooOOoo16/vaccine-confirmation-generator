const mongoose = require('mongoose');
const logger = require('../logger/logger');

mongoose.set('strictQuery', true);
mongoose
    .connect(`${process.env.MONGODB_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        logger.info('MONGOOSE | Connected to MongoDB successfully !');
    })
    .catch(err => {
        logger.error(`MONGOOSE | ${err} : DB connection failed !`);
    });
