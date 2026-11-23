# Add Home 

## 1. Overview

The Add Home feature allows a host to register a new property on the Airbnb application.

The host fills out a form containing the home's details, such as:
- House name
- Price
- Location
- Rating
- Image URL

When the form is submitted, the application creates a new `Home` object and saves its data into the MySQL `homes` table.

The feature follows the MVC architecture:
- **Model:** Handles the database insertion.
- **Controller:** Handles the submitted form data and response.
- **View:** Displays the form to the host.

## 2. Request Flow

1. The host visits the Add Home page.
2. The `getAddHome()` controller renders the `host/edit-home` EJS template.
3. The host fills in the home details and submits the form.
4. The request reaches the `postAddHome()` controller.
5. The controller extracts the submitted values using `req.body`.
6. A new instance of the `Home` class is created.
7. The controller calls the object's `save()` method.
8. Since the new Home object does not have an ID, the model executes the INSERT query.
9. MySQL inserts the new record into the `homes` table.
10. After successful insertion, the host is redirected to the host home list.

## 3. Controller – `getAddHome()`

```js
exports.getAddHome = (req, res, next) => {
    console.log(req.url, req.method);

    res.render('host/edit-home', {
        editing: false,
    });
};
```

### Understanding the controller

This controller displays the form used to register a new home.

- `res.render()` renders the `host/edit-home` EJS template.
- `editing: false` tells the view that the form is being used to add a new home rather than edit an existing one.

The same EJS template is reused for both adding and editing homes.

## 4. Controller – `postAddHome()`

```js
exports.postAddHome = (req, res, next) => {
    console.log(`Home registration successful for:`, req.body.houseName);

    const { houseName, price, location, rating, image } = req.body;

    const home = new Home(houseName, price, location, rating, image);

    home.save()
        .then(() => {
            res.redirect('/host/host-home-list');
        })
        .catch((error) => {
            console.log("error adding home", error);
        });
};
```

### Understanding the controller

**1. Extract form data**

```js
const { houseName, price, location, rating, image } = req.body;
```

`req.body` contains the values submitted through the form.

Object destructuring extracts the individual properties.

**2. Create a Home object**

```js
const home = new Home(houseName, price, location, rating, image);
```

A new instance of the Home class is created using the submitted values.

At this point, the object does not have an ID because it represents a new home.

**3. Save the home**

```js
home.save()
    .then(() => {
        res.redirect('/host/host-home-list');
    });
```

The `save()` method handles the database operation.

After successful insertion, the host is redirected to the home list.

## 5. Model – `save()`

The Home model contains a `save()` method that handles both inserting and updating records.

For the Add Home feature, the INSERT branch is executed because the new Home object does not have an ID.

```js
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
```

### Understanding the SQL query

```sql
INSERT INTO homes (houseName, price, location, rating, image)
VALUES (?, ?, ?, ?, ?);
```

- `INSERT INTO homes` specifies the table where the new record will be added.
- The column names specify which fields will receive values.
- The question marks are parameterized query placeholders.
- The values array supplies the corresponding data.

The ID is not included in the query because MySQL generates it automatically when the ID column is configured as `AUTO_INCREMENT`.

## 6. Why Use Parameterized Queries?

An earlier version of the INSERT query directly embedded the submitted values into the SQL string.

That approach is vulnerable to SQL injection and can also cause problems with special characters and quotation marks.

The current implementation uses placeholders:

```js
db.execute(
    'INSERT INTO homes (houseName, price, location, rating, image) VALUES (?, ?, ?, ?, ?)',
    [this.houseName, this.price, this.location, this.rating, this.image]
);
```

This separates SQL instructions from the values being inserted and helps prevent SQL injection.

## 7. Important Concepts Learned

- Handling GET and POST requests
- Rendering EJS forms
- Extracting submitted data using `req.body`
- Object destructuring
- Creating class instances
- Model methods and database operations
- SQL INSERT queries
- Parameterized queries
- MySQL AUTO_INCREMENT
- Promise-based database operations
- Redirecting after successful form submission
- MVC architecture

## 8. Key Takeaway

The Add Home feature demonstrates how form data travels from the frontend to the backend and is eventually stored in a database.

The controller handles the request and creates a Home object, while the model is responsible for inserting the record into MySQL.

The `save()` method determines whether to INSERT or UPDATE based on whether the Home object has an ID.

**Request flow:**

Route → Controller → `req.body` → Home Object → `save()` → MySQL INSERT → Redirect