const registeredHomes = [];

module.exports = class Home {
    constructor(houseName, price, location, rating, image) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.image = image;
    }

    // short syntax of fn inside constructor fn
    save() {
        registeredHomes.push(this.houseName)
    }

    static fetchAll() {
        return registeredHomes;
    }
}