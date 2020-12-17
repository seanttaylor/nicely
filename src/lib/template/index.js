const ejs = require("ejs");
const { promisify } = require("util");
const renderFile = promisify(ejs.renderFile);


/**
 * Creates a new email template 
 * @param {String} filePath - file path to a template
 * @param {Object} data - data used in the rendered template
 * @returns {String} a rendered HTML string
 */

function EmailTemplate({filePath, data}) {
    const template = await renderFile(filePath, data);
    return template;
}

module.exports = EmailTemplate;