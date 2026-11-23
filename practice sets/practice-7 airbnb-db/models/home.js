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
        if (this.id) { //update 
            console.log('update branch');

            return db.execute(
                `UPDATE homes SET houseName =?, price=?, location =?, rating=?, image=?
                WHERE id=?`,
                [this.houseName, this.price, this.location, this.rating, this.image, this.id]
            );
        } else {
            console.log('insert branch');

            // NOT USED BCZ OF SQL injection attack
            // return db.execute(`INSERT INTO homes (houseName, price, location, rating, image, id) VALUES(' ${this.houseName}' ,' ${this.price}' ,' ${this.location}' ,' ${this.rating}' ,' ${this.image}' , ' ${this.id}')`)
            return db.execute(
                `INSERT INTO homes (houseName, price, location, rating, image)
             VALUES (?, ?, ?, ?, ?)`,
                [
                    this.houseName,
                    this.price,
                    this.location,
                    this.rating,
                    this.image
                ]
            );
        }
    }

    static fetchAll() {
        return db.execute('SELECT * FROM homes')

    }

    static findById(homeId) {
        return db.execute('SELECT * FROM homes WHERE id = ?', [homeId])
    }
    static deleteById(homeId) {
        return db.execute('DELETE FROM homes WHERE id = ?', [homeId])

    }
}