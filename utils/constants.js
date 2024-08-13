module.exports = emailTemplate = ({email, name, bookingData}) => ({
    from: `"Phuket-Concierge" < ${process.env.ADMIN_EMAIL_ID}>`, // sender address
    to: `${bookingData.roomBookDetails.customerEmail}, ${process.env.ADMIN_EMAIL_ID}`, // list of receivers
    subject: "Your Booking has been confirmed ✔", // Subject line
    text: "Hello", // plain text body
    html: `<b>Greetings</b>,<br><br>
            We are glad to inform you that we confirmed your booking with <b>${bookingData.hotelName}</b>!!<br>
            <h2>Booking Details</h2>
            <ul>
                <li> <b>Check-in : ${bookingData.roomBookDetails.checkIn} </b> </li>
                <li> <b>Check-out : ${bookingData.roomBookDetails.checkOut} </b> </li>
            </ul>
            <h2> Room Details </h2>
            <ul>
                <li><b> Booking Reference Number: ${bookingData.referenceNum}</b></li>
                <li><b>Room Types : ${bookingData.roomBookDetails.rooms[0].name} </b> </li>
                <li><b> Cancellation Policy: ${bookingData.roomBookDetails.fareType} - ${bookingData.roomBookDetails.cancellationPolicy}</b></li>
                <li><b>Number of days : ${bookingData.roomBookDetails.days} </b> </li>
                <li><b>Location: <a href=https://maps.google.com/?q=${bookingData.geoData.lat},${bookingData.geoData.long}>Click Here</a></b></li>
            </ul> 
            
            ` // html body
});