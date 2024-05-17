const axios = require('axios');
const makeRequest = async({method, body={}, url, headers={ "Content-Type":false, "X-Forwarded-For":"185.137.122.196"}, ...defaultConfig}) => {
    try{
    const response = await axios({
        method: method,
        url: url,
        data: body,
        headers: headers,
        ...defaultConfig
    });
    return response.data;
}catch(err){
    console.log(err);
}
}
module.exports = makeRequest;