const moment = require('moment');

function getTimeNow() {
    return moment().format('LT');
}

module.exports = {
    getTimeNow,
};
