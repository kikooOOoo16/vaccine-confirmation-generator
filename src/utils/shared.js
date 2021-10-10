const toCyrillic = require('./langmap');

checkIfValidQueryFields = async function(reqQueryParams, allowedQueryParams) {
    const validQueryParams = reqQueryParams.every(queryParam => allowedQueryParams.includes(queryParam));

    if (!validQueryParams || reqQueryParams.length === 0) {
        throw ('Invalid query params!');
    }
}

transformQueryFields = async function (reqQueryParams) {
    for (let param in reqQueryParams) {
        if (reqQueryParams.hasOwnProperty(param)) {
            if (param !== 'date' && param !== 'vaccine' && param !== 'id') {
                reqQueryParams[param] = reqQueryParams[param] + ' / ' + toCyrillic(reqQueryParams[param]);
            }
            if (param === 'id') {
                reqQueryParams[param] = reqQueryParams[param].replace(/[-]/g, '#');
            }
        }
    }
}

const flashMessageOptions = {
    position:"t",
    duration:"3000"
};

handleLoginErrors = async function (err, user, info, res) {
    if (err) {
        console.log(`handleLoginErrors err: ${err}`);
        res.flash(`Error: ${err}`, 'error', {flashMessageOptions});
        res.redirect('/login');
    }
    if (!user) {
        if (info) {
            console.log(`handleLoginErrors info: ${info}`);
            res.flash(`Error: ${info}`, 'info', {flashMessageOptions});
        }
        res.redirect('/login');
    }
}

module.exports = {checkIfValidQueryFields, transformQueryFields, handleLoginErrors};