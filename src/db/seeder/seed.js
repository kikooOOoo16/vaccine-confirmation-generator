/* eslint-disable no-unused-vars */
const logger = require('../../logger/logger');
const mongoose = require('mongoose');
const Patient = require('../../models/patient');
const {firstNames, lastNames, cityNames} = require('./mock-data');

// Function to seed the database
async function seedDatabase() {
    logger.debug('SEEDER: Seed DB running...');
    try {
        await connectToDB();
        // Retrieve all patients from the database
        // const patients = await Patient.find();

        // Update the city field for each patient with a random city name
        // await updatePatientCities(patients);

        await addUnvaccinatedPatients(15);

        logger.debug('Database seeding complete');
    } catch (error) {
        logger.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        logger.debug('Disconnecting from the DB...');
        await mongoose.disconnect();
    }
}

async function addUnvaccinatedPatients(numOfPatients) {
    logger.debug('SEEDER: Add unvaccinated patients called...');

    for (let i = 0; i < numOfPatients; i++) {
        const patient = new Patient({
            name: getRandomData(firstNames),
            surname: getRandomData(lastNames),
            city: getRandomData(cityNames),
            certificate_code: 'null',
            application_date: 'null',
            vaccine: 'null',
        });
        await patient.save();
    }

    logger.debug(`SEEDER: Successfully added ${numOfPatients} unvaccinated patients to DB`);
}

async function updatePatientCities(patients) {
    logger.debug('SEEDER: Update patient cities called...');
    for (const patient of patients) {
        patient.city = getRandomData(cityNames);
        await patient.save(); // Save the updated patient
    }

    logger.debug('SEEDER: Successfully updated patient cities');
}

// Function to generate a random city name
function getRandomData(dataArray) {
    return dataArray[Math.floor(Math.random() * dataArray.length)];
}

async function connectToDB() {
    mongoose.set('strictQuery', true);

    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        logger.error(`${err} : DB connection failed !`);
    }

    logger.info('Connected to MongoDB successfully !');
}

// Call the function to seed the database
seedDatabase();
