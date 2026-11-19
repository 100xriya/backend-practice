const db = require("../Utils/databaseUtil")

module.exports = class Home {
    constructor(houseName, price, location, rating, image, id) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.image = image;
        this.id = id;
    }

    save() {
    }

    static fetchAll() {
        return db.execute('SELECT * FROM homes')

    }

    static findById(homeId, callback) {

    }
    static deleteById(homeId, callback) {

    }
}