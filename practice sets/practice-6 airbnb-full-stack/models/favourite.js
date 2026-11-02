const fs = require('fs');
const path = require('path');
const rootDir = require('../Utils/pathUtil');

const favouriteDataPath = path.join(rootDir, "data", "favourite.json");

module.exports = class Favourite {

    static addToFavourite(homeId, callback) {
        Favourite.getFavourites((favourites) => {

            if (favourites.includes(homeId)) {
                callback("home is already in fav-list");
            } else {
                favourites.push(homeId);
                fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
            }

        });
    }

    static getFavourites(callback) {
        fs.readFile(favouriteDataPath, (err, data) => {
            if (!err) {
                callback(JSON.parse(data));
            } else {
                callback([]);
            }
        })
    }

    static deleteFavs(homeId, callback) {
        Favourite.getFavourites(favourites => {
            const updatedFavsList = favourites.filter(
                favourite => favourite !== homeId
            )

            fs.writeFile(favouriteDataPath, JSON.stringify(updatedFavsList), callback);
        })

    }
}

