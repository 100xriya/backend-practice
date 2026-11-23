# Home Details – MySQL Integration

## 1. Overview

The Home Details feature displays complete information about a specific home when a user selects it from the home listing page.

In the MySQL-integrated version, the application retrieves the selected home's information from the `homes` table using its unique ID.

Instead of searching through a JSON file, the application now uses a SQL query to fetch the matching record.

## 2. Request Flow

1. The user clicks on a home to view its details.
2. The request reaches the user router.
3. The controller extracts the `homeId` from the route parameters.
4. The controller calls `Home.findById(homeId)`.
5. The model executes a parameterized SQL query.
6. MySQL returns the matching record.
7. The controller extracts the home object from the query result.
8. If the home exists, the details page is rendered.
9. If no matching home exists, the user is redirected to the homepage.

## 3. Controller – `getHomeDetails`

```js
exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;

    console.log(`homeId of chosen house for details: ${homeId}`);

    Home.findById(homeId)
        .then(([homes]) => {
            const home = homes[0];

            if (!home) {
                console.log('Home not found');
                return res.redirect("/");
            }

            console.log('Home details found', home);

            res.render('user/home-detail', {
                home: home,
            });
        })
        .catch(next);
};
```

### Understanding the controller

- **`req.params.homeId`**: Extracts the home ID from the URL.
- **`Home.findById(homeId)`**: Calls the model method responsible for retrieving the home.
- **`.then()`**: Runs when the database query succeeds.
- **`([homes])`**: Extracts the rows array from the MySQL result.
- **`homes[0]`**: Gets the first matching home record.
- **`if (!home)`**: Checks whether the query returned a matching record.
- **`res.render()`**: Sends the home object to the EJS details page.
- **`.catch(next)`**: Passes database or Promise errors to Express's error-handling middleware.

## 4. Model – `findById()`

The model handles the database interaction.

```js
static findById(homeId) {
    return db.execute(
        'SELECT * FROM homes WHERE id = ?',
        [homeId]
    );
}
```

### Understanding the SQL query

```sql
SELECT * FROM homes WHERE id = ?;
```

- `SELECT *` retrieves all columns from the matching record.
- `FROM homes` specifies the table.
- `WHERE id = ?` filters the records using the supplied home ID.
- `[homeId]` provides the value for the placeholder.

### Why use `?` instead of directly inserting the ID?

The question mark is a parameterized query placeholder.

Instead of building SQL by concatenating user-provided values, we pass the value separately:

```js
db.execute('SELECT * FROM homes WHERE id = ?', [homeId]);
```

This helps prevent SQL injection and avoids manually constructing SQL strings.

## 5. Understanding the MySQL Result

The `mysql2` package returns a Promise from `db.execute()`.

When the query succeeds, the Promise resolves to an array containing:

```js
[rows, fields]
```

Here:

- `rows` contains the matching database records.
- `fields` contains metadata about the returned columns.

This is why the controller uses:

```js
.then(([homes]) => {
    const home = homes[0];
});
```

The first destructuring operation extracts `rows` and assigns it to `homes`. Then `homes[0]` accesses the first record.

## 6. Error Handling vs. Missing Records

These are two different situations:

**Case 1: Home not found**

The SQL query succeeds, but no record matches the supplied ID. MySQL returns an empty rows array.

```js
if (!home) {
    return res.redirect("/");
}
```

**Case 2: Database error**

The query fails, perhaps because of a connection or SQL error.

```js
.catch(next);
```

This forwards the error to Express's error-handling middleware.

A missing record is not a database error, so it should be handled separately.

## 7. Concepts Learned

- Dynamic route parameters using `req.params`
- Fetching individual records using SQL
- Parameterized queries and SQL injection prevention
- MySQL Promise-based operations
- Array destructuring
- Accessing records from query results
- Conditional handling when a record doesn't exist
- Express error-handling middleware

## Key Takeaway

The controller manages the request and decides what response to send, while the model handles the database query.

The flow is:

**Route → Controller → Model → MySQL → Controller → EJS View**

This keeps database logic separate from request-handling logic, following the MVC architecture.