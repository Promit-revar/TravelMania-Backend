module.exports = emailTemplate = ({email, name, bookingData}) => ({
    from: `"Phuket-Concierge" < ${process.env.ADMIN_EMAIL_ID}>`, // sender address
    to: `${email}, ${process.env.ADMIN_EMAIL_ID}`, // list of receivers
    subject: "Your Booking has been confirmed ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Greetings</b>&nbsp; Mr. ${name},<br><br>
            We are glad to inform you that your booking is confirmed!!<br>
            <h2>Booking Details</h2>
            <ul>
                <li> <b>Check-in : ${bookingData.checkIn} </b> </li>
                <li> <b>Check-out : ${bookingData.checkOut} </b> </li>
                <li><b> Cancellation Policy: ${bookingData.cancellationPolicy}</b></li>
            </ul>
            <h2> Room Details </h2>
            <ul>
                <li> <b>Room Type : ${bookingData.rooms[0].name} </b> </li>
                <li> <b>Number of Guests : ${bookingData.rooms[0].paxDetails.name.length} </b> </li>
            </ul>
            <h2>Booking For</h2>
            <ul>
            ${bookingData.rooms[0].paxDetails.name.map(guest => `<li><b>${guest}</b></li>`)}
            </ul>
            ` // html body
});