# User Home Listing – MySQL Integration

## 1. Overview

The Home Listing feature displays all registered homes to users on the homepage.

Previously, home data was retrieved from a local JSON file. In the MySQL-integrated version, the application fetches home records directly from the `homes` table in the database.

## 2. Request Flow

1. The user visits the homepage.
2. The request is handled by the user router.
3. The router calls `getHome()` from the user controller.
4. The controller calls `Home.fetchAll()` from the Home model.
5. The model executes a SELECT query on the MySQL database.
6. Once the query resolves, the controller extracts the returned rows.
7. The retrieved homes are passed to the `home-list.ejs` view.
8. EJS renders the homes dynamically.

## 3. Controller Implementation

**File:** `controller/userController.js`

```js
exports.getHome = (req, res, next) => {
    Home.fetchAll()
        .then(([registeredHomes]) => {
            res.render('user/home-list', {
                registeredHomes: registeredHomes
            });
        })
        .catch(next);
};
```

### Explanation

- `Home.fetchAll()` calls the model method responsible for retrieving all home records.
- `.then()` executes when the database query successfully resolves.
- `[registeredHomes]` uses array destructuring to extract the first element of the result returned by `mysql2`.
- `res.render()` passes the retrieved records to the EJS template.
- `.catch(next)` forwards any database or Promise errors to Express error-handling middleware.

## 4. Database Interaction

The controller relies on the `fetchAll()` method in the Home model.

The model executes:

```sql
SELECT * FROM homes;
```

The query retrieves all records from the `homes` table.

Since the application uses `mysql2` with its Promise API, `db.execute()` resolves with an array containing:

- `rows` – the retrieved database records.
- `fields` – metadata about the returned columns.

The controller extracts the first element (`rows`) using array destructuring.

## 5. Concepts Learned

- **MVC architecture:** The controller handles the request and response, while the model handles database operations.
- **Promises:** Database queries are asynchronous, so `.then()` handles the result after the query completes.
- **Array destructuring:** Used to extract the rows from the result returned by `mysql2`.
- **Error handling:** `.catch(next)` forwards errors to Express error-handling middleware.
- **Dynamic rendering:** EJS receives database records and generates the homepage dynamically.

## 6. Key Takeaway

The homepage is now connected directly to MySQL instead of relying on JSON file storage. The controller retrieves the database records asynchronously and passes them to the EJS view for rendering.