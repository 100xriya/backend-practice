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

        Home.fetchAll((registeredHomes) => {
            if (this.id) { //edit home case
                registeredHomes = registeredHomes.map(home => {
                    if (home.id === this.id) {
                        return this;
                    }
                    return home;
                })
            } else { //add home case
                this.id = Math.random().toString();
                registeredHomes.push(this);

            }
            const homeDataPath = path.join(rootDir, 'data', 'homes.json');
            fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (err) => {
                if (err) {
                    console.log('Error saving home:', err);
                }
            });
        });
    }

    static fetchAll(callback) {
        const homeDataPath = path.join(rootDir, 'data', 'homes.json');
        // Starts reading the JSON file. File reading is asynchronous, so Node.js can continue executing other code while it waits.
        fs.readFile(homeDataPath, (err, data) => {
            if (!err) {
                callback(JSON.parse(data));
            } else {
                callback([]);
            }
        })
    }

    static findById(homeId, callback) {
        this.fetchAll(homes => {
            const homeFound = homes.find(home => home.id === homeId);
            callback(homeFound);
        })
    }
    static deleteById(homeId, callback) {
        this.fetchAll(homes => {
            // if id matches then delete, if not ->keep it.
            homes = homes.filter(home => home.id !== homeId);

            const homeDataPath = path.join(rootDir, 'data', 'homes.json');
            fs.writeFile(homeDataPath, JSON.stringify(homes), callback);

        })
    }
}