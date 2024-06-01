const router = require("express").Router();
const jwt = require("jsonwebtoken");
const BASE_URL = "https://travelnext.works/api/hotel_trawexv6/";
const makeRequest = require("../utils/makeRequest");
const createStripeSession = require("../utils/stripeConfig");
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
    const url = BASE_URL + "hotel_book";
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
      res.status(400).json({ sucess: false, error: response.status.errors });
    } else {
      // console.log(req.body)
      const stripeSession = await createStripeSession({
        price: response.roomBookDetails.NetPrice,
        currency: response.roomBookDetails.currency,
        data: {checkIn: response.roomBookDetails.checkIn, checkOut: response.roomBookDetails.checkOut, refNo: response.referenceNum, cancellationPolicy: response.roomBookDetails.cancellationPolic, rooms: response.roomBookDetails.rooms, email: response.roomBookDetails.customerEmail, lat: req.body.geoData.lat, long: req.body.geodata.long},
      });
      res.status(200).json({ bookingData: response, stripeSession });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});
module.exports = router;
