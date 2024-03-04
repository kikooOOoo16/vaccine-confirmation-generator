// Get the canvas element
const vaccinationChartByCityCtx = document.getElementById('vaccinationChartByCity').getContext('2d');
const sumVaccinatedUnvaccinatedChartCtx = document.getElementById('sumVaccinatedUnvaccinatedChart').getContext('2d');
const parsedVaccinationStatusPerCityData = JSON.parse(vaccinationStatusPerCityData);
const vaxPerCityColumns = [];
const vaccinatedArray = [];
const unvaccinatedArray = [];
let totalVaccinated = 0;
let totalUnvaccinated = 0;

for (const {city, vaccinated, unvaccinated} of parsedVaccinationStatusPerCityData) {
    vaxPerCityColumns.push(city);
    vaccinatedArray.push(vaccinated);
    unvaccinatedArray.push(unvaccinated);
    totalVaccinated += vaccinated;
    totalUnvaccinated += unvaccinated;
}

const vaxStatusPerCityChartData = {
    labels: vaxPerCityColumns.sort(),
    datasets: [
        {
            label: 'Vaccinated patients',
            data: vaccinatedArray,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: 'Unvaccinated patients',
            data: unvaccinatedArray,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
    ],
};

const sumVaccinatedUnvaccinatedChartData = {
    labels: ['Vaccinated', 'Unvaccinated'],
    datasets: [
        {
            label: 'Sum of vaccinated vs unvaccinated patients',
            data: [totalVaccinated, totalUnvaccinated],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
};

new Chart(vaccinationChartByCityCtx, {
    type: 'bar',
    data: vaxStatusPerCityChartData,
    options: {
        // Customize chart options as needed
        // For example, you can configure axes, legends, tooltips, etc.
    },
});

new Chart(sumVaccinatedUnvaccinatedChartCtx, {
    type: 'bar',
    data: sumVaccinatedUnvaccinatedChartData,
    options: {
        // Customize chart options as needed
        // For example, you can configure axes, legends, tooltips, etc.
    },
});
