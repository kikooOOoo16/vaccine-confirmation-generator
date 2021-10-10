const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => {
        console.log('Connected to DB successfully !');
}).catch(err => {
    console.log(`${err} : DB connection failed !`);
});