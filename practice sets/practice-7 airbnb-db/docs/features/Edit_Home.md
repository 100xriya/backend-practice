# Edit Home 

## 1. Overview

The Edit Home feature allows a host to modify the details of an already registered home.

The host can update information such as:
- House name
- Price
- Location
- Rating
- Image URL

In the MySQL-integrated version, the application retrieves the existing home using its ID, displays its current information in the edit form, and updates the corresponding database record when the form is submitted.

The same `save()` method in the Home model handles both inserting new homes and updating existing ones.

## 2. Request Flow

### A. Display the Edit Form – `getEditHome()`

1. The host clicks the Edit button for a registered home.
2. The request reaches the host router.
3. The controller extracts the `homeId` from `req.params`.
4. The controller calls `Home.findById(homeId)`.
5. The model executes a parameterized SQL query to retrieve the matching home.
6. The controller extracts the home record from the query result.
7. If the home exists, the controller renders `host/edit-home` and passes the existing home details to the view.
8. If the home doesn't exist, the host is redirected to the host home list.

### B. Submit the Edited Form – `postEditHome()`

1. The host modifies the home details and submits the form.
2. The form sends the updated values, including the existing home ID.
3. The controller extracts the submitted values using `req.body`.
4. A new `Home` object is created using the submitted details.
5. The existing ID is assigned to the Home object.
6. The controller calls `home.save()`.
7. Since the object has an ID, the model executes an SQL `UPDATE` query instead of an `INSERT`.
8. After the update succeeds, the host is redirected to the host home list.

## 3. Controller – `getEditHome()`

```js
exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === "true";

    Home.findById(homeId)
        .then(([homes]) => {
            const home = homes[0];

            if (!home) {
                console.log("Home not found in list for editing");
                return res.redirect("/host/host-home-list");
            }

            console.log(homeId, editing, home);

            res.render('host/edit-home', {
                home: home,
                editing: editing,
                homeId: homeId,
            });
        })
        .catch(error => {
            console.log("Error fetching home for editing:", error);
            next(error);
        });
};
```

### Understanding the controller

**1. Extract the home ID**

```js
const homeId = req.params.homeId;
```

The home ID comes from the dynamic route parameter.

It identifies which home the host wants to edit.

**2. Check the editing query parameter**

```js
const editing = req.query.editing === "true";
```

This checks whether the URL contains `?editing=true`.

The result is a Boolean value that can be passed to the EJS view to distinguish editing mode from adding mode.

**3. Retrieve the existing home**

```js
Home.findById(homeId)
    .then(([homes]) => {
        const home = homes[0];
    });
```

The model retrieves the matching database record. Since `mysql2` returns `[rows, fields]`, destructuring extracts the rows array, and `homes[0]` accesses the matching record.

**4. Handle a missing home**

```js
if (!home) {
    return res.redirect("/host/host-home-list");
}
```

If no matching record exists, the controller redirects instead of trying to render a form with missing data.

**5. Render the edit form**

```js
res.render('host/edit-home', {
    home: home,
    editing: editing,
    homeId: homeId,
});
```

The existing home object is passed to the EJS template so the form can display its current values.

## 4. Controller – `postEditHome()`

```js
exports.postEditHome = (req, res, next) => {
    console.log(`Home edited successful for:`, req.body, req.body.houseName);

    const { id, houseName, price, location, rating, image } = req.body;

    const home = new Home(houseName, price, location, rating, image);
    home.id = id;

    home.save()
        .then(() => {
            res.redirect('/host/host-home-list');
        })
        .catch((error) => {
            console.log("error editing home", error);
        });
};
```

### Understanding the controller

**1. Extract the submitted form values**

```js
const { id, houseName, price, location, rating, image } = req.body;
```

The submitted form data is available through `req.body`.

Object destructuring extracts each property into a separate variable.

**2. Create a Home object**

```js
const home = new Home(houseName, price, location, rating, image);
```

A new instance of the Home class is created using the updated values.

**3. Assign the existing ID**

```js
home.id = id;
```

This is a critical step.

The ID tells the model that this object represents an existing database record.

Without the ID, `this.id` would be falsy inside `save()`, causing the model to execute the INSERT branch and create a new home instead.

**4. Call `save()`**

```js
home.save()
    .then(() => {
        res.redirect('/host/host-home-list');
    });
```

The model checks whether the object has an ID and chooses the appropriate SQL operation.

After the update succeeds, the host is redirected to the home list.

## 5. Model – `findById()`

```js
static findById(homeId) {
    return db.execute(
        'SELECT * FROM homes WHERE id = ?',
        [homeId]
    );
}
```

This method retrieves the existing home using its ID.

- `SELECT *` retrieves all columns.
- `WHERE id = ?` filters the record using the supplied ID.
- `[homeId]` provides the value for the parameterized query.

The method returns a Promise from `db.execute()`.

## 6. Model – `save()`

The `save()` method handles both creating and updating home records.

```js
save() {
    if (this.id) {
        console.log('update branch');

        return db.execute(
            `UPDATE homes SET houseName =?, price=?, location =?, rating=?, image=?
            WHERE id=?`,
            [
                this.houseName,
                this.price,
                this.location,
                this.rating,
                this.image,
                this.id
            ]
        );
    } else {
        console.log('insert branch');

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
```

### How does the model decide between INSERT and UPDATE?

The decision is based on whether the Home object has an ID.

**If `this.id` exists:**

The UPDATE query executes.

```sql
UPDATE homes
SET houseName = ?, price = ?, location = ?, rating = ?, image = ?
WHERE id = ?;
```

The `WHERE id = ?` condition ensures that only the selected home is modified.

**If `this.id` doesn't exist:**

The INSERT query executes.

```sql
INSERT INTO homes (houseName, price, location, rating, image)
VALUES (?, ?, ?, ?, ?);
```

A new database record is created. MySQL generates its ID if the column is configured as `AUTO_INCREMENT`.

### Why use one `save()` method for both operations?

Instead of creating separate methods for adding and editing homes, the model uses one method that determines the appropriate operation based on the object's state.

This keeps the database logic inside the model and reduces duplication.

## 7. Important Concepts Learned

- Dynamic route parameters using `req.params`
- Query parameters using `req.query`
- Retrieving individual records from MySQL
- Passing database records to EJS views
- Extracting submitted form data using `req.body`
- Object destructuring
- Creating class instances
- Assigning an existing ID to an object
- Conditional SQL operations using `if...else`
- Parameterized UPDATE and INSERT queries
- Promise-based database operations
- MVC architecture and separation of responsibilities

## 8. Key Takeaway

The Edit Home feature demonstrates how the same model method can handle two different database operations.

The controller creates a Home object and assigns its existing ID before calling `save()`.

The model uses that ID to decide whether to update an existing record or insert a new one.

**Request flow:**

**Display form:**

Route → Controller → Home Model → MySQL SELECT → Controller → EJS Edit Form

**Submit form:**

Route → Controller → Home Object → `save()` → MySQL UPDATE → Redirect

The ID is the key that distinguishes an existing home from a new home.