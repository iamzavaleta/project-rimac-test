
const middy = require("@middy/core")
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')

module.exports = (handler => middy(handler)
    .use([
        jsonBodyParser(),
        httpErrorHandler()
    ])
)