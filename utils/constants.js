module.exports = emailTemplate = ({email, name, bookingData}) => ({
    from: `"Phuket-Concierge" < ${process.env.ADMIN_EMAIL_ID}>`, // sender address
    to: `${bookingData.email}, ${process.env.ADMIN_EMAIL_ID}`, // list of receivers
    subject: "Your Booking has been confirmed ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Greetings</b>&nbsp; Mr. ${name},<br><br>
            We are glad to inform you that your booking is confirmed!!<br>
            <h2>Booking Details</h2>
            <ul>
                <li> <b>Check-in : ${bookingData.checkIn} </b> </li>
                <li> <b>Check-out : ${bookingData.checkOut} </b> </li>
            </ul>
            <h2> Room Details </h2>
            <ul>
                <li> <b>Room Types : ${bookingData.rooms[0].name} </b> </li>
                <li><b> Cancellation Policy: ${bookingData.cancellationPolicy}</b></li>
                <li> <b>Number of Guests : ${bookingData.guests} </b> </li>
                <li> <b>Location: <a href=https://maps.google.com/?q=${bookingData.lat},${bookingData.long}>Click Here</a></b></li>
            </ul> 
            
            ` // html body
});