module.exports = {
    select: (status,options) => {
        return options.fn(this).replace(new RegExp(' value=\"'+status+'\"'),'$&selected="status"');
    }
}