const router = require('express').Router();
const BASE_URL = "https://travelnext.works/api/hotel_trawexv6/";
const makeRequest = require('../utils/makeRequest');
router.get('/',(req,res)=>{
    res.send("Hello World!");
})
router.post('/hotel_search',async (req,res)=>{
  console.log(req.body);
    const payload = {
      "user_id": process.env.USER_NAME,
      "user_password": process.env.USER_PASSWORD,
      "ip_address": process.env.IP_ADDRESS,
       ...req.body
      };
    const url = BASE_URL+"hotel_search";
    const response = await makeRequest({method:'POST',url:url, body:{...payload}});
    res.json(response);
});
router.get('/hotelDetails',async (req,res)=>{
  const params = {...req.params};
  const url = BASE_URL+"hotelDetails";
  const response = await makeRequest({method: 'GET', url: url, params:{...req.params}});
  res.json(response);
});
router.get('/moreResults', async (req,res)=>{
  const params = {...req.params};
  const url = BASE_URL+"moreResults";
  const response = await makeRequest({method: 'GET', url: url, params:{...params}});
  res.json(response);
});
router.post('/filterResults', async (req,res) => {
  const payload = {...req.body}
  const url = BASE_URL+"filterResults";
  const response = await makeRequest({method: 'POST', url, body:{...payload}});
  res.json(response);
});
router.get('/moreFilterResults', async (req,res) => {
  const params = {...req.params};
  const url = BASE_URL+"moreFilterResults?";
  const response = await makeRequest({method: 'GET', url: url, params:{...params}});
  res.json(response);
})
module.exports = router;