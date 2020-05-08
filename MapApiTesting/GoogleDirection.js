const request = require('request')
const drUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=metrotown&destination=BCIT%20SW1&key=AIzaSyB05M9WVnhk7NLh8gSFUxkiOVJecxU5tK0'
console.log(drUrl)
console.log('hello')
// request({
//     url:drUrl,
//     json:true},
//     (err,resp)=>{
//         console.log(resp.body.routes[0])
// })

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: 'Metrotown',
        destination: 'BCIT SW1',
        travelMode: 'walking'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}