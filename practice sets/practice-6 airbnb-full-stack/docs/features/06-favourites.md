# Favourites Feature

## 1. Objective

The Favourites feature allows users to save properties they are interested in and view them later from a dedicated Favourites page.

When a user clicks the Add to Favourites button on a property, the application stores that property's unique ID in `favourite.json`.

When the user opens the Favourites page, the application retrieves the saved IDs, fetches the registered homes, and displays only the properties whose IDs are present in the favourites list.

The feature uses two separate JSON files:

- `homes.json` stores the complete information about registered properties.
- `favourite.json` stores the IDs of properties added to favourites.

This avoids duplicating complete property records in multiple files.

## 2. User Workflow

### A. Adding a home to Favourites

1. The user opens the Home Listing page.
2. The user selects a property they are interested in.
3. The user clicks the Add to Favourites button.
4. The browser sends a POST request containing the property's ID.
5. The controller receives the ID.
6. The model reads the existing favourites from `favourite.json`.
7. The model checks whether the home is already in the favourites list.
8. If it is not already present, its ID is added to the array.
9. The updated favourites array is written to `favourite.json`.
10. The user is redirected or receives the appropriate response.

### B. Viewing the Favourites list

1. The user opens the Favourites page.
2. The backend reads the saved IDs from `favourite.json`.
3. The backend retrieves all registered homes from `homes.json`.
4. The application compares the home IDs with the saved favourite IDs.
5. Matching homes are collected into a new array.
6. The controller passes this array to the Favourites EJS view.
7. The user sees only their favourite properties.

## 3. Request-Response Flow

### A. Adding a home to Favourites

```text
User clicks Add to Favourites
          |
          v
POST /user/favourites
          |
          v
User Router
          |
          v
postFavList Controller
          |
          v
Extract homeId from req.body
          |
          v
Favourite.addToFavourite(homeId)
          |
          v
Read favourite.json
          |
          v
Check whether homeId already exists
          |
          +--------------------------+
          |                          |
          v                          v
Already exists                 Not in favourites
          |                          |
          v                          v
Return duplicate result       Add homeId to array
                                     |
                                     v
                              Write favourite.json
                                     |
                                     v
                              Return callback
                                     |
                                     v
                              Redirect/respond
```

### B. Displaying the Favourites page

```text
User opens Favourites
          |
          v
GET /user/favourites
          |
          v
User Router
          |
          v
getFavList Controller
          |
          v
Favourite.getFavourites()
          |
          v
Read favourite.json
          |
          v
Receive favourite IDs
          |
          v
Home.fetchAll()
          |
          v
Read homes.json
          |
          v
Filter homes using favourite IDs
          |
          v
Create favouriteHomes array
          |
          v
Render user/favourites.ejs
          |
          v
Display favourite property cards
```

## 4. Implementation Procedure

### Step 1: Create the favourites data file

Create a separate file to store the IDs of favourite properties.

```text
data/
    homes.json
    favourite.json
```

Example contents of `favourite.json`:

```json
[
  "0.12345",
  "0.67890"
]
```

These values represent the IDs of homes stored in `homes.json`.

**Why store only IDs?**

The home information already exists in `homes.json`.

Storing the complete home object again would duplicate data. If a property's information changes, duplicated records could become inconsistent.

Storing IDs keeps the favourites collection smaller and allows the application to retrieve the latest property information from the original homes collection.

### Step 2: Add the Add to Favourites form

Each property card needs an action that sends the selected home's ID to the backend.

An example form:

```ejs
<form action="/user/favourites" method="POST">
  <input
    type="hidden"
    name="homeId"
    value="<%= home.id %>"
  />

  <button type="submit">
    Add to Favourites
  </button>
</form>
```

**Why use a hidden input?**

The user doesn't need to manually enter or modify the home ID.

The hidden input sends the ID along with the form submission so the backend knows which property should be added.

### Step 3: Define the routes

The user router needs two routes:

```js
userRouter.get(
  "/user/favourites",
  userController.getFavList
);

userRouter.post(
  "/user/favourites",
  userController.postFavList
);
```

The GET route displays the Favourites page.

The POST route processes the request to add a property to the favourites list.

### Step 4: Create the Favourite model

A separate model is used to manage favourite IDs.

This keeps favourite-related file operations separate from the Home model.

The model uses the file-system module and the project's root directory utility.

```js
const fs = require('fs');
const path = require('path');
const rootDir = require('../Utils/pathUtil');

const favouriteDataPath = path.join(
  rootDir,
  'data',
  'favourite.json'
);

module.exports = class Favourite {

  static addToFavourite(homeId, callback) {
    Favourite.getFavourites(favourites => {

      if (favourites.includes(homeId)) {
        callback("home is already in fav-list");
      } else {
        favourites.push(homeId);

        fs.writeFile(
          favouriteDataPath,
          JSON.stringify(favourites),
          callback
        );
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
    });
  }

};
```

### Step 5: Implement `getFavourites()`

This method retrieves the saved favourite IDs.

```js
static getFavourites(callback) {
  fs.readFile(favouriteDataPath, (err, data) => {
    if (!err) {
      callback(JSON.parse(data));
    } else {
      callback([]);
    }
  });
}
```

**How it works:**

1. `fs.readFile()` reads `favourite.json`.
2. `JSON.parse()` converts the JSON text into a JavaScript array.
3. The array is passed to the controller or calling method through the callback.
4. If the file cannot be read, the method returns an empty array.

This method is reused when adding a favourite and when displaying the Favourites page.

### Step 6: Implement `addToFavourite()`

This method adds a home ID to the favourites collection.

```js
static addToFavourite(homeId, callback) {
  Favourite.getFavourites(favourites => {

    if (favourites.includes(homeId)) {
      callback("home is already in fav-list");
    } else {
      favourites.push(homeId);

      fs.writeFile(
        favouriteDataPath,
        JSON.stringify(favourites),
        callback
      );
    }

  });
}
```

**How it works:**

1. The method retrieves the existing favourites using `getFavourites()`.
2. `includes()` checks whether the supplied ID is already present.
3. If it exists, the method returns a duplicate message through the callback.
4. Otherwise, `push()` adds the new ID.
5. `fs.writeFile()` saves the updated array.

**Why use `includes()`?**

Without this check, repeatedly clicking Add to Favourites could insert the same ID multiple times.

`includes()` prevents duplicate entries in the stored array.

### Step 7: Create the POST controller

The controller receives the submitted home ID and delegates the operation to the Favourite model.

```js
exports.postFavList = (req, res, next) => {
  const homeId = req.body.homeId;

  Favourite.addToFavourite(homeId, error => {
    if (error) {
      return next(error);
    }

    res.redirect('/user/favourites');
  });
};
```

**Understanding the controller:**

- `req.body.homeId` retrieves the ID submitted by the form.
- `Favourite.addToFavourite()` performs the data operation.
- The callback receives the result.
- If an error occurs, it is passed to the error-handling middleware.
- Otherwise, the user is redirected to the Favourites page.

The redirect must happen inside the callback because writing to the file is asynchronous.

**Note:** The current model uses a string to indicate that a home is already in the favourites list. A duplicate is an expected user action rather than necessarily a server error, so a better implementation would return a structured result and handle duplicates separately.

### Step 8: Create the GET controller for the Favourites page

The Favourites page needs more than just the saved IDs.

It needs the complete home objects so that the EJS view can display their names, images, prices, locations, and ratings.

```js
exports.getFavList = (req, res, next) => {
  Favourite.getFavourites(favourites => {

    Home.fetchAll(registeredHomes => {

      const favouriteHomes = registeredHomes.filter(
        home => favourites.includes(String(home.id))
      );

      res.render('user/favourites', {
        favouriteHomes
      });

    });

  });
};
```

**Understanding the controller:**

1. `Favourite.getFavourites()` retrieves the saved IDs.
2. `Home.fetchAll()` retrieves all registered home objects.
3. `filter()` checks every registered home.
4. `favourites.includes(String(home.id))` checks whether that home's ID exists in the favourites array.
5. Matching homes are stored in `favouriteHomes`.
6. The controller renders the Favourites page and passes the matching homes to the view.

**Why use `filter()` here?**

We want to retrieve every registered home whose ID exists in the favourites array.

Unlike `find()`, which returns only the first matching home, `filter()` returns an array containing all matching homes.

### Step 9: Understand ID type consistency

One important issue encountered during development was that some home IDs were stored as numbers while the favourite IDs were stored as strings.

For example:

```js
const homeId = 0.3;
const favouriteId = "0.3";

console.log(homeId === favouriteId); // false
```

Although the values look identical, JavaScript treats them as different types.

The controller uses:

```js
favourites.includes(String(home.id))
```

This converts the home ID into a string before comparison.

The better long-term approach is to maintain a consistent ID format throughout the application, preferably storing all IDs as strings.

### Step 10: Render the Favourites view

Create the dedicated EJS view:

```text
views/
    user/
        favourites.ejs
```

The controller passes `favouriteHomes` to this view.

The view can iterate over the array and display the saved properties.

Example:

```ejs
<% favouriteHomes.forEach(home => { %>

  <div class="home-card">

    <img
      src="<%= home.image %>"
      alt="<%= home.houseName %>"
    />

    <h2><%= home.houseName %></h2>

    <p><%= home.location %></p>

    <p>₹<%= home.price %></p>

    <p><%= home.rating %></p>

  </div>

<% }) %>
```

The view displays only the properties selected by the controller.

## 5. Files Involved

| File | Responsibility |
|---|---|
| User home-list EJS view | Provides the Add to Favourites form |
| User router | Defines GET and POST favourites routes |
| User controller | Handles adding favourites and retrieving the favourites page |
| Favourite model | Reads and updates the favourite IDs |
| Home model | Retrieves complete property records |
| `views/user/favourites.ejs` | Displays favourite property cards |
| `data/favourite.json` | Stores favourite home IDs |
| `data/homes.json` | Stores complete property information |

## 6. Important Concepts Learned

- **Separate models:** Keeping favourite operations separate from home operations.
- **Separate data collections:** Storing favourite IDs independently from home records.
- **Hidden inputs:** Passing a selected property's ID through a form.
- **`req.body`:** Accessing submitted form values.
- **`includes()`:** Checking whether an array contains a particular ID.
- **`push()`:** Adding a new favourite ID to an array.
- **`filter()`:** Retrieving all homes whose IDs exist in the favourites collection.
- **`String()`:** Converting IDs to a consistent type before comparison.
- **Callbacks:** Handling asynchronous file reading and writing.
- **Data relationships:** Using IDs to connect records stored in separate files.
- **Code reuse:** Reusing `Home.fetchAll()` to retrieve property information.

## 7. Bugs and Important Lessons

### A. Only some favourites were appearing

An issue encountered during development was that only three favourite properties appeared, even though more IDs were stored in `favourite.json`.

The problem was inconsistent ID types.

For example:

```js
// homes.json
{
  "id": 0.3
}
```

```js
// favourite.json
[
  "0.3"
]
```

The comparison failed because one value was a number and the other was a string.

**Solution:**

```js
favourites.includes(String(home.id))
```

**Lesson:** JavaScript's strict equality and array membership checks are type-sensitive. IDs should have a consistent representation across the application.

### B. Prevent duplicate favourites

A user might click Add to Favourites multiple times for the same property.

The `includes()` check prevents the same ID from being added repeatedly.

### C. Do not redirect before the file write completes

The controller must wait for the `fs.writeFile()` callback before redirecting.

Otherwise, the browser could navigate away before the data operation finishes.

### D. Keep complete home records separate from favourite IDs

The favourites file should store references to properties, not duplicate property objects.

This keeps the data structure simpler and avoids having to update the same property information in multiple places.

### E. Deleting a home can leave a stale favourite ID

When a home is deleted from `homes.json`, its ID can still remain in `favourite.json`.

The Favourites controller won't find a corresponding home to display, but the stale ID remains stored.

This relationship needs to be handled when implementing or improving Delete Home.

## 8. Current Limitations and Future Improvements

- **User-specific favourites:** The current implementation uses one shared favourites collection. With authentication, each user should have their own favourites.
- **Remove from Favourites:** Users should be able to remove saved properties.
- **Duplicate handling:** Duplicate favourites should produce a friendly message rather than being treated as an unexpected server error.
- **Stale references:** Deleting a home should also remove its ID from the favourites collection.
- **Validation:** The backend should verify that the submitted home ID belongs to an existing property.
- **Error handling:** File-reading and writing errors should be handled consistently.
- **Database relationships:** In a database-based version, favourites could be represented using a relationship between users and homes.
- **Concurrency:** Multiple simultaneous file writes can cause data consistency problems with JSON-based storage.

## 9. Final Feature Summary

The Favourites feature demonstrates how an application can maintain a separate collection of references to existing records.

Instead of storing complete home objects again, the application stores home IDs in `favourite.json` and uses those IDs to retrieve the corresponding records from `homes.json`.

The feature follows the MVC pattern:

- The **view** sends the selected home ID and displays favourite properties.
- The **router** directs GET and POST requests.
- The **controller** coordinates adding favourites and retrieving the matching homes.
- The **Favourite model** manages the saved favourite IDs.
- The **Home model** retrieves the complete property records.
- The **JSON files** store the home records and favourite references separately.

The most important learning was understanding how two separate collections can be connected using a shared ID.

**Data flow:**

Add to Favourites → Home ID → Favourite Model → `favourite.json`

Display Favourites → Favourite IDs + Home Records → Match IDs → EJS Favourites Page