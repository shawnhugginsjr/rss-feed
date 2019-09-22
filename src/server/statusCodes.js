
/*
* HTTP status codes that correspond with the succuss of an API
* request. 
* OK - Everything worked as expected.
* Bad Request - The request was unacceptable, often due to missing a required parameter.
* Unauthorized - The user wasn't logged in.
* Not Found	- The requested resource doesn't exist.
* Internal - Internal server error
*/
const codes = {
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    internal: 500
}

module.exports = codes