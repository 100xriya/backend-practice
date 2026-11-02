# Bookings Feature

## 1. Objective

Allow users to:
- Book a home from the home listing page.
- View all their booked homes on the bookings page.
- Remove a home from their bookings.

The current implementation stores home IDs in a separate `bookings.json` file rather than modifying the original `homes.json` data.

## 2. Data Structure

**File:** `data/bookings.json`

The file stores an array of home IDs:

```json
[
  "101",
  "102",
  "103"
]
```

The actual home details remain in `homes.json`.

This separation means:
- `homes.json` stores complete home objects.
- `bookings.json` stores only the IDs of booked homes.

When displaying bookings, the application uses these IDs to retrieve the corresponding home objects.

## 3. Feature Overview

The bookings feature has three main operations:

| Operation | HTTP Method | Route |
|---|---|---|
| Display bookings | GET | `/user/bookings` |
| Add booking | POST | `/user/bookings` |
| Remove booking | POST | `/user/bookings/delete-bookings/:homeId` |

## 4. Add a Booking

### 4.1 Frontend — Booking Form

**File:** `views/user/home-list.ejs`

Each home has a booking form:

```ejs
<form action="/user/bookings" method="POST">
    <input type="hidden" name="homeId" value="<%= home.id %>" />

    <button type="submit"
        class="bg-blue-500 text-white font-bold px-3 py-2 rounded-lg self-center hover:bg-blue-600 mt-5">
        Book it!
    </button>
</form>
```

**Important concepts:**

- `action="/user/bookings"` specifies the destination route.
- `method="POST"` sends a POST request.
- The hidden input sends the selected home's ID without displaying it to the user.
- `name="homeId"` determines the property name used to access the value through `req.body.homeId`.
- `type="submit"` ensures that clicking the button submits the form.

### 4.2 Router

**File:** `routes/userRouter.js`

```js
userRouter.post(
    "/user/bookings",
    getUserController.postBookingList
);
```

The router forwards the POST request to the booking controller.

### 4.3 Controller

**File:** `controller/userController.js`

```js
exports.postBookingList = (req, res, next) => {
    const homeId = req.body.homeId;

    Bookings.addToBookings(homeId, error => {
        if (error) {
            return next(error);
        }

        res.redirect('/user/bookings');
    });
};
```

**Controller responsibilities:**

1. Extract the home ID from the submitted form.
2. Call `Bookings.addToBookings()` to save the booking.
3. Pass errors to the error-handling middleware.
4. Redirect to the bookings page after the operation completes.

### 4.4 Model

**File:** `models/bookings.js`

```js
static addToBookings(homeId, callback) {
    Bookings.getBookings((bookings) => {

        if (bookings.includes(homeId)) {
            callback("home is already booked");
        } else {
            bookings.push(homeId);

            fs.writeFile(
                bookingsDataPath,
                JSON.stringify(bookings),
                callback
            );
        }

    });
}
```

**How it works:**

1. Calls `getBookings()` to retrieve the existing booking IDs.
2. Uses `includes()` to check whether the home is already booked.
3. If the ID already exists, returns an error message through the callback.
4. Otherwise, adds the ID to the array.
5. Writes the updated array to `bookings.json`.

The `includes()` check prevents duplicate IDs from being added.

## 5. Display Bookings

### 5.1 Router

**File:** `routes/userRouter.js`

```js
userRouter.get(
    "/user/bookings",
    getUserController.getBookingList
);
```

This route handles requests to view the bookings page.

### 5.2 Controller

**File:** `controller/userController.js`

```js
exports.getBookingList = (req, res, next) => {
    Bookings.getBookings((bookings) => {

        Home.fetchAll((registeredHomes) => {

            const bookedHomes = registeredHomes.filter(home =>
                bookings.includes(String(home.id))
            );

            res.render('user/bookings', {
                bookedHomes: bookedHomes
            });

        });

    });
};
```

**How it works:**

1. Calls `Bookings.getBookings()` to retrieve the array of booked home IDs.
2. Calls `Home.fetchAll()` to retrieve all registered home objects.
3. Uses `filter()` to find homes whose IDs exist in the bookings array.
4. Uses `String(home.id)` to ensure the home ID is compared as a string.
5. Passes the matching home objects to the EJS view.

**Why do we need both models?**

`bookings.json` contains only IDs, so it doesn't have the home names, prices, locations, or images.

The controller retrieves the actual home objects from `homes.json` and matches them using their IDs.

### 5.3 EJS View

**File:** `views/user/bookings.ejs`

The bookings page receives:

```js
{
    bookedHomes: bookedHomes
}
```

The EJS view can iterate over the `bookedHomes` array to display each booked home.

For example:

```ejs
<% bookedHomes.forEach(home => { %>
    <h2><%= home.houseName %></h2>
    <p><%= home.location %></p>
    <p><%= home.price %></p>
<% }) %>
```

The actual home details come from the original home objects, not from `bookings.json`.

## 6. Remove a Booking

### 6.1 Frontend — Remove Button

**File:** `views/user/bookings.ejs`

Each booked home should have a form that sends its ID to the removal route.

```ejs
<form action="/user/bookings/delete-bookings/<%= home.id %>" method="POST">
    <button type="submit">
        Remove from bookings
    </button>
</form>
```

The form submits the selected home's ID through the URL.

### 6.2 Router

**File:** `routes/userRouter.js`

```js
userRouter.post(
    '/user/bookings/delete-bookings/:homeId',
    getUserController.postRemoveBookings
);
```

The `:homeId` route parameter identifies which booking should be removed.

### 6.3 Controller

**File:** `controller/userController.js`

```js
exports.postRemoveBookings = (req, res, next) => {
    const homeId = req.params.homeId;

    Bookings.deleteBookings(homeId, (error) => {
        if (error) {
            return next(error);
        }

        res.redirect('/user/bookings');
    });
};
```

**Controller responsibilities:**

1. Extract the home ID using `req.params.homeId`.
2. Call `Bookings.deleteBookings()`.
3. Handle any file-operation errors.
4. Redirect to the bookings page after the operation completes.

### 6.4 Model

**File:** `models/bookings.js`

```js
static deleteBookings(homeId, callback) {
    Bookings.getBookings(bookings => {

        const updatedBookingList = bookings.filter(
            booking => booking !== homeId
        );

        fs.writeFile(
            bookingsDataPath,
            JSON.stringify(updatedBookingList),
            callback
        );

    });
}
```

**How it works:**

1. Retrieves the existing booking IDs.
2. Uses `filter()` to create a new array excluding the selected home ID.
3. Writes the updated array back to `bookings.json`.
4. Passes the file-writing callback to the controller.

For example:

Before removing home `"102"`:

```js
["101", "102", "103"]
```

After removing home `"102"`:

```js
["101", "103"]
```

The home itself is not deleted. Only its ID is removed from the bookings array.

## 7. Retrieve Existing Bookings

**File:** `models/bookings.js`

```js
static getBookings(callback) {
    fs.readFile(bookingsDataPath, (err, data) => {

        if (!err) {
            callback(JSON.parse(data));
        } else {
            callback([]);
        }

    });
}
```

This method is shared by the add, display, and remove operations.

**How it works:**

- Reads `bookings.json` asynchronously.
- If reading succeeds, parses the JSON data into a JavaScript array.
- If reading fails, returns an empty array through the callback.

This allows the other model methods to work with the existing bookings without repeating the file-reading logic.

## 8. Complete Request Flow

### Add booking

```text
Home Listing Page
       |
       | POST /user/bookings
       v
User Router
       |
       v
postBookingList (Controller)
       |
       | req.body.homeId
       v
Bookings.addToBookings()
       |
       v
Bookings.getBookings()
       |
       v
Check for duplicate ID
       |
       v
Add ID to array
       |
       v
Write bookings.json
       |
       v
Redirect to /user/bookings
```

### Display bookings

```text
GET /user/bookings
       |
       v
getBookingList (Controller)
       |
       v
Bookings.getBookings()
       |
       v
Home.fetchAll()
       |
       v
Filter homes using booked IDs
       |
       v
Render user/bookings.ejs
```

### Remove booking

```text
Bookings Page
       |
       | POST /user/bookings/delete-bookings/:homeId
       v
User Router
       |
       v
postRemoveBookings (Controller)
       |
       v
Bookings.deleteBookings()
       |
       v
Bookings.getBookings()
       |
       v
Filter out selected ID
       |
       v
Write updated bookings.json
       |
       v
Redirect to /user/bookings
```

## 9. Files Involved

| File | Responsibility |
|---|---|
| `views/user/home-list.ejs` | Displays the booking form |
| `views/user/bookings.ejs` | Displays booked homes and removal forms |
| `routes/userRouter.js` | Defines booking-related routes |
| `controller/userController.js` | Handles booking requests |
| `models/bookings.js` | Contains booking data operations |
| `models/home.js` | Retrieves registered home objects |
| `data/bookings.json` | Stores booked home IDs |
| `data/homes.json` | Stores complete home objects |

## 10. Important Concepts Learned

- **POST requests:** Submitting data that changes server-side state.
- **Hidden form inputs:** Sending values that don't need to be visible in the interface.
- **`req.body`:** Accessing submitted form data.
- **`req.params`:** Accessing dynamic URL parameters.
- **`Array.includes()`:** Checking whether an ID already exists in an array.
- **`Array.filter()`:** Creating a new array containing only elements that satisfy a condition.
- **Callbacks:** Handling asynchronous operations and passing results between model and controller.
- **`fs.readFile()`:** Reading stored JSON data.
- **`fs.writeFile()`:** Persisting updated JSON data.
- **MVC architecture:** Separating routes, controllers, models, and views.
- **Data separation:** Keeping booking IDs separate from the original home objects.

## 11. Bugs and Debugging Considerations

### 1. Button not submitting the form

**Problem:**

```html
<button type="button">Book it!</button>
```

**Cause:** A button with `type="button"` does not submit its parent form.

**Fix:**

```html
<button type="submit">Book it!</button>
```

### 2. Router and controller method names not matching

**Problem:** The router referenced `getBookings`, `postBookings`, and `postRemoveBooking`, while the controller exported `getBookingList`, `postBookingList`, and `postRemoveBookings`.

**Cause:** The method names must match exactly when the router accesses the controller exports.

**Fix:** Use consistent method names in both files.

### 3. Reading the wrong form property

**Problem:**

```js
req.body.id
```

**Cause:** The hidden input uses `name="homeId"`, not `name="id"`.

**Fix:**

```js
req.body.homeId
```

### 4. Inconsistent ID types

**Problem:** Comparing numeric home IDs against string IDs can cause a mismatch.

**Fix:** Store and compare IDs consistently as strings.

For example:

```js
bookings.includes(String(home.id))
```

## 12. Current Limitations and Future Improvements

The current implementation is a learning-stage booking system, not a complete reservation system.

Possible improvements:

- Associate bookings with individual users after implementing authentication.
- Store booking dates and other reservation details.
- Add booking confirmation and success messages.
- Handle duplicate booking attempts with a user-friendly message.
- Validate that the requested home actually exists before accepting a booking.
- Prevent multiple users from booking the same home when introducing real reservations.
- Handle malformed JSON and file-reading errors separately from a genuinely empty bookings list.
- Eventually migrate from JSON files to a database.

**Important architectural distinction:** At present, `bookings.json` represents a single global list of booked home IDs. It does not track which user made a booking, and it does not implement date-based availability or prevent different users from booking the same home.

---

**Feature status:** Add booking, display bookings, and remove booking implemented using JSON file storage.