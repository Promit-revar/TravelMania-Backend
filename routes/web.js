const router = require('express').Router();
const BASE_URL = "https://travelnext.works/api/hotel_trawexv6/";
const makeRequest = require('../utils/makeRequest');
router.get('/',(req,res)=>{
    res.send("Hello World!");
})
router.post('/hotel_search',async (req,res)=>{
    const payload = {
      "user_id": process.env.USER_NAME,
      "user_password": process.env.USER_PASSWORD,
      "ip_address": process.env.IP_ADDRESS,
       ...req.body
      };
    const url = BASE_URL+"hotel_search";
    const response = await makeRequest({method:'POST',url:url, body:{...payload}});
    if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'error')){
      res.status(500).json({success: false, error: 'Something went wrong'});
    }
    else if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'errors')){
      res.status(400).json({sucess: false, error:response.status.errors})
    }
    else{
      res.status(200).json(response);
    }
});
router.get('/hotelDetails',async (req,res)=>{
  const params = {...req.query};
  const url = BASE_URL+"hotelDetails";
  const response = await makeRequest({method: 'GET', url: url, params:{...params}});
  if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'error')){
    res.status(500).json({success: false, error: 'Something went wrong'});
  }
  else if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'errors')){
    res.status(400).json({sucess: false, error:response.status.errors})
  }
  else{
    res.status(200).json(response);
  }
});
router.get('/moreResults', async (req,res)=>{
  const params = {...req.query};
  const url = BASE_URL+"moreResults";
  const response = await makeRequest({method: 'GET', url: url, params:{...params}});
  if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'error')){
    res.status(500).json({success: false, error: 'Something went wrong'});
  }
  else if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'errors')){
    res.status(400).json({sucess: false, error:response.status.errors})
  }
  else{
    res.status(200).json(response);
  }
});
router.post('/filterResults', async (req,res) => {
  const payload = {...req.body}
  const url = BASE_URL+"filterResults";
  const response = await makeRequest({method: 'POST', url, body:{...payload}});
  if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'error'))
    res.json({success: false, error: response.status.error});
  else
    res.json(response);
});
router.get('/moreFilterResults', async (req,res) => {
  const params = {...req.query};
  const url = BASE_URL+"moreFilterResults?";
  const response = await makeRequest({method: 'GET', url: url, params:{...params}});
  if(Object.hasOwn(response,'status') && Object.hasOwn(response.status,'error'))
    res.json({success: false, error: response.status.error});
  else
    res.json(response);
})
module.exports = router;