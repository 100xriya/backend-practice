# Remove a Home from Favourites

## 1. Objective

Allow users to remove a previously favourited home from their favourites list.

Instead of deleting the actual home listing, this feature removes only its ID from `favourite.json`.

## 2. Feature Workflow

1. User opens the favourites page.
2. Each favourited home displays a **Remove from favourites** button.
3. User clicks the button.
4. A POST request is sent with the home's ID.
5. The controller extracts the ID from the request parameters.
6. The Favourite model reads the existing favourite IDs.
7. The selected home ID is removed from the array.
8. The updated array is written back to `favourite.json`.
9. The controller redirects the user to the favourites page.

## 3. Request Flow

```text
Favourites Page (EJS)
        |
        | POST /user/favourites/delete-favs/:homeId
        v
User Router
        |
        v
postRemoveFavourite (Controller)
        |
        | Favourite.deleteFavs(homeId)
        v
Favourite Model
        |
        | getFavourites()
        v
Read favourite.json
        |
        | filter out matching homeId
        v
Write updated array to favourite.json
        |
        v
Controller redirects to /user/favourites
```

## 4. Frontend — Remove Button

**File:** `views/user/favourites.ejs`

Each home has a form containing a remove button.

```ejs
<form action="/user/favourites/delete-favs/<%= home.id %>" method="POST"
      class="w-full place-content-center">
  <button type="submit"
    class="bg-red-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-600 mt-5">
    Remove from favourites
  </button>
</form>
```

### Important concepts

- `home.id` dynamically inserts the ID of the selected home into the form action.
- `method="POST"` sends a POST request.
- Each home gets its own form, so the correct home ID is sent when its button is clicked.

## 5. Router

**File:** `routes/userRouter.js`

```js
userRouter.post(
  '/user/favourites/delete-favs/:homeId',
  getUserController.postRemoveFavourite
);
```

### Important concepts

- `POST` is used because the request modifies stored data.
- `:homeId` is a route parameter.
- `req.params.homeId` retrieves the ID from the URL.

## 6. Controller

**File:** `controller/userController.js`

```js
exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.params.homeId;

  Favourite.deleteFavs(homeId, (error) => {
    if (error) {
      return next(error);
    }

    res.redirect('/user/favourites');
  });
};
```

### Controller responsibilities

1. Extract the home ID from the request.
2. Call the model method to remove the favourite.
3. Pass any file-operation error to the error-handling middleware.
4. Redirect to the favourites page after the operation completes.

**Why redirect inside the callback?**

`fs.writeFile()` is asynchronous. Placing the redirect inside its callback ensures the controller redirects only after the file-writing operation has completed.

## 7. Model

**File:** `models/favourite.js`

```js
static deleteFavs(homeId, callback) {
  Favourite.getFavourites(favourites => {
    const updatedFavsList = favourites.filter(
      favourite => favourite !== homeId
    );

    fs.writeFile(
      favouriteDataPath,
      JSON.stringify(updatedFavsList),
      callback
    );
  });
}
```

### How the model works

**Step 1 — Retrieve existing favourites**

```js
Favourite.getFavourites(favourites => {
```

Calls the existing `getFavourites()` method to read the favourite IDs from `favourite.json`.

**Step 2 — Filter out the selected ID**

```js
const updatedFavsList = favourites.filter(
  favourite => favourite !== homeId
);
```

`filter()` creates a new array containing every favourite ID except the one being removed.

For example:

Before:

```js
["101", "102", "103"]
```

If `homeId` is `"102"`, the updated array becomes:

```js
["101", "103"]
```

**Step 3 — Save the updated array**

```js
fs.writeFile(
  favouriteDataPath,
  JSON.stringify(updatedFavsList),
  callback
);
```

Writes the updated favourites array back into `favourite.json`.

## 8. Files Involved

| File | Responsibility |
|---|---|
| `views/user/favourites.ejs` | Displays the remove button for each home |
| `routes/userRouter.js` | Defines the POST route |
| `controller/userController.js` | Handles the request and redirects |
| `models/favourite.js` | Removes the ID and updates the JSON file |
| `data/favourite.json` | Stores the updated favourite IDs |

## 9. Important Concepts Learned

- **HTTP POST:** Used to submit a request that changes server-side data.
- **Route parameters:** Passing dynamic values through URLs using `:homeId`.
- **Array.filter():** Creates a new array excluding elements that match a condition.
- **Asynchronous file operations:** Waiting for the file-writing callback before redirecting.
- **Separation of concerns:** The controller handles the request; the model handles data operations.
- **Static methods:** Calling `Favourite.getFavourites()` because it is a static method of the Favourite class.

## 10. Bugs Encountered and Their Causes

### Bug 1 — Incorrect form action

Initially, the form action was:

```ejs
action="/favourites/delete-favs/<%= home.id %>"
```

But the router expected:

```text
/user/favourites/delete-favs/:homeId
```

**Cause:** The URL in the form did not match the registered route.

**Fix:** Added the missing `/user` prefix.

### Bug 2 — Incorrect model method name

Initially:

```js
Favourite.fetchAll(...)
```

**Error:**

```text
TypeError: Favourite.fetchAll is not a function
```

**Cause:** The Favourite model does not define `fetchAll()`. Its method for reading favourite IDs is named `getFavourites()`.

**Fix:**

```js
Favourite.getFavourites(...)
```

### Bug 3 — Incorrect assumption about stored data

The first filtering attempt used:

```js
favourite => home.id != homeId
```

**Cause:** `favourite.json` stores an array of IDs, not home objects. Therefore, there is no `home.id` property to access in this array.

**Fix:**

```js
favourite => favourite !== homeId
```

## 11. Possible Future Improvements

- Show a success message after removing a favourite.
- Handle cases where the requested home ID is not in the favourites array.
- Associate favourites with individual users after implementing authentication.
- Clean up favourite IDs automatically when a host deletes a home.
- Consider using a database instead of JSON files as the application grows.

---

**Feature status:** Remove from favourites implemented and working.