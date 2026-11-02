const fs = require('fs');
const path = require('path');
const rootDir = require('../Utils/pathUtil');

const bookingsDataPath = path.join(rootDir, "data", "bookings.json");

module.exports = class Bookings {

    static addToBookings(homeId, callback) {
        Bookings.getBookings((bookings) => {

            if (bookings.includes(homeId)) {
                callback("home is already booked");
            } else {
                bookings.push(homeId);
                fs.writeFile(bookingsDataPath, JSON.stringify(bookings), callback);
            }

        });
    }

    static getBookings(callback) {
        fs.readFile(bookingsDataPath, (err, data) => {
            if (!err) {
                callback(JSON.parse(data));
            } else {
                callback([]);
            }
        })
    }

    static deleteBookings(homeId, callback) {
        Bookings.getBookings(bookings => {
            const updatedBookingList = bookings.filter(
                booking => booking !== homeId
            )

            fs.writeFile(bookingsDataPath, JSON.stringify(updatedBookingList), callback);
        })

    }
}

