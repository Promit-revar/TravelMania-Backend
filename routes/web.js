const router = require("express").Router();
const jwt = require("jsonwebtoken");
const BASE_URL = "https://travelnext.works/api/hotel_trawexv6/";
const makeRequest = require("../utils/makeRequest");
const createStripeSession = require("../utils/stripeConfig");
const sendEmail = require('../utils/sendMail');
const NodeCache = require( "node-cache" );
const puppeteer = require('puppeteer');
const cacheStore = new NodeCache();
router.get("/", (req, res) => {
  res.send("Hello World!");
});
router.post("/hotel_search", async (req, res) => {
  const payload = {
    user_id: process.env.USER_NAME,
    user_password: process.env.USER_PASSWORD,
    ip_address: process.env.IP_ADDRESS,
    maxResult: Number.MAX_SAFE_INTEGER,
    ...req.body,
  };
  const url = BASE_URL + "hotel_search";
  const response = await makeRequest({
    method: "POST",
    url: url,
    body: { ...payload },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  ) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  } else if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "errors")
  ) {
    res.status(400).json({ sucess: false, error: response.status.errors });
  } else {
    res.status(200).json(response);
  }
});
router.post("/store", (req,res)=>{
    const payload = {...req.body};
    const token = jwt.sign(
      {
        ...payload,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({success: true, token })
});
router.get("/hotelDetails", async (req, res) => {
  const params = { ...req.query };
  const url = BASE_URL + "hotelDetails";
  const response = await makeRequest({
    method: "GET",
    url: url,
    params: { ...params },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  ) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  } else if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "errors")
  ) {
    res.status(400).json({ sucess: false, error: response.status.errors });
  } else {
    res.status(200).json(response);
  }
});
router.get("/moreResults", async (req, res) => {
  const params = { ...req.query };
  const url = BASE_URL + "moreResults";
  const response = await makeRequest({
    method: "GET",
    url: url,
    params: { ...params },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  ) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  } else if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "errors")
  ) {
    res.status(400).json({ sucess: false, error: response.status.errors });
  } else {
    res.status(200).json(response);
  }
});
router.post("/filterResults", async (req, res) => {
  const payload = { ...req.body };
  const url = BASE_URL + "filterResults";
  const response = await makeRequest({
    method: "POST",
    url,
    body: { ...payload },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  )
    res.json({ success: false, error: response.status.error });
  else res.json(response);
});
router.get("/moreFilterResults", async (req, res) => {
  const params = { ...req.query };
  const url = BASE_URL + "moreFilterResults?";
  const response = await makeRequest({
    method: "GET",
    url: url,
    params: { ...params },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  )
    res.json({ success: false, error: response.status.error });
  else res.json(response);
});
router.post("/get_room_rates", async (req, res) => {
  const payload = { ...req.body };
  const url = BASE_URL + "get_room_rates";
  const response = await makeRequest({
    method: "POST",
    url: url,
    body: { ...payload },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  ){
    res.json({ success: false, error: response.status.error });
  }
  else if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "errors")
  ) {
    res.json({ sucess: false, error: response.status.errors });
  } else res.status(200).json(response);
});
router.post("/get_rate_rules", async (req, res) => {
  const payload = { ...req.body };
  const url = BASE_URL + "get_rate_rules";
  const response = await makeRequest({
    method: "POST",
    url: url,
    body: { ...payload },
  });
  if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "error")
  )
    res.json({ success: false, error: response.status.error });
  else if (
    Object.hasOwn(response, "status") &&
    Object.hasOwn(response.status, "errors")
  ) {
    res.json({ sucess: false, error: response.status.errors });
  } else res.status(200).json(response);
});
router.post("/booking", async (req, res) => {
  try {
    const payload = { ...req.body.requestData };
    const {sessionId, productId, tokenId, rateBasisId} = payload;
    const rateURL = BASE_URL + "get_rate_rules";
  const getPrice= await makeRequest({
    method: "POST",
    url: rateURL,
    body: {sessionId, productId, tokenId, rateBasisId},
  });
  const geoData = req.body.geoData;
  const hotelName = req.body.hotelName;
  cacheStore.set('payload',{...payload,geoData, hotelName});
    // const response = await makeRequest({
    //   method: "POST",
    //   url: url,
    //   body: { ...payload },
    // });
    const stripeSession = await createStripeSession({
        price: getPrice.roomRates.perBookingRates[0].netPrice,
        currency: getPrice.roomRates.perBookingRates[0].currency,
        data: geoData,
      });
    res.status(200).json({ stripeSession });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});
router.get('/booking-confirmation',async(req,res)=>{
    try{
      const payload = cacheStore.get('payload');
      if(!payload) throw new Error('Operation Not Permitted');
      const response = await makeBooking(payload);
      if(response){
        cacheStore.del('payload');
        await sendEmail({email: response.roomBookDetails.customerEmail, bookingData: {...response, geoData: payload.geoData, hotelName: payload.hotelName}});
      }
      res.status(201).json({...response, geoData: payload.geoData, hotelName: payload.hotelName});
    }catch(err){
      res.status(500).json({success: false, error: err.message});
    }
});
const makeBooking = async(payload) => {
  const url = BASE_URL+"hotel_book";
  return await makeRequest({
    method: "POST",
    url: url,
    body: { ...payload },
  });
}
router.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  if (!htmlContent) {
      return res.status(400).send('HTML content is required');
  }

  try {
    //   const browser = await puppeteer.launch({
    //     executablePath: '/usr/bin/chromium-browser',
    //     args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
    //   });
    //   const page = await browser.newPage();
      
    //   await page.setContent(htmlContent);
    //   await page.pdf({
    //     printBackground: true
    // })
    //   const pdfBuffer = await page.pdf({ format: 'A4' });
      
    //   await browser.close();
      const pdfBuffer = await generatePDF(htmlContent);
      res.type('application/pdf');
      res.send(pdfBuffer);
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
  }
});
const generatePDF = async(htmlContent) => {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
    });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    await page.pdf({
      printBackground: true
  })
    const pdfBuffer = await page.pdf({ format: 'A4' });
    
    await browser.close();
    return pdfBuffer;
}
module.exports = {router, makeBooking};
