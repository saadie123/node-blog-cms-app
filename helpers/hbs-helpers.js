const moment = require('moment');

module.exports = {
    select: (status,options) => {
        return options.fn(this).replace(new RegExp(' value=\"'+status+'\"'),'$&selected="status"');
    },
    dateFormat: (date,format) => {
        return moment(date).format(format);
    }
}