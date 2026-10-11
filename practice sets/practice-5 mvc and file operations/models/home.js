const fs = require('fs');
const path = require('path');
const rootDir = require('../Utils/pathUtil');


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
        const homeDataPath = path.join(rootDir, 'data', 'homes.json');

        Home.fetchAll((registeredHomes) => {
            registeredHomes.push(this);

            fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (err) => {
                if (err) {
                    console.log('Error saving home:', err);
                }
            });
        });
    }

    static fetchAll(callback) {
        const homeDataPath = path.join(rootDir, 'data', 'homes.json');
        fs.readFile(homeDataPath, (err, data) => {
            if (!err) {
                callback(JSON.parse(data));
            } else {
                callback([]);
            }
        })
    }
}