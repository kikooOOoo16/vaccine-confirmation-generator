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
            if (param !== 'date' && param !== 'vaccine') {
                reqQueryParams[param] = reqQueryParams[param] + ' / ' + toCyrillic(reqQueryParams[param]);
            }
        }
    }
}

module.exports = {checkIfValidQueryFields, transformQueryFields};