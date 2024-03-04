const toCyrillic = require('./langmap');

const checkIfValidQueryFields = async function (reqQueryParams, allowedQueryParams) {
    const validQueryParams = reqQueryParams.every(queryParam => allowedQueryParams.includes(queryParam));

    if (!validQueryParams || reqQueryParams.length === 0) {
        throw 'Invalid query params!';
    }
};

const transformQueryFields = async function (reqQueryParams) {
    for (let param in reqQueryParams) {
        if (Object.prototype.hasOwnProperty.call(reqQueryParams, param)) {
            if (param !== 'date' && param !== 'vaccine' && param !== 'id') {
                reqQueryParams[param] = reqQueryParams[param] + ' / ' + toCyrillic(reqQueryParams[param]);
            }
            if (param === 'id') {
                reqQueryParams[param] = reqQueryParams[param].replace(/[-]/g, '#');
            }
        }
    }
};

module.exports = {checkIfValidQueryFields, transformQueryFields};
