# Home Details Feature

## 1. Objective

The Home Details feature allows users to view the complete information of an individual property.

From the Home Listing page, a user can select a property and open its dedicated details page.

The application identifies the selected property using its unique ID, retrieves the corresponding record from `homes.json`, and renders a separate EJS page containing that property's information.

Instead of displaying every property, this feature focuses on one selected home.

## 2. User Workflow

1. The user opens the Home Listing page.
2. The application displays all registered properties.
3. The user clicks the Details button on a property card.
4. The browser sends a GET request containing the selected property's ID.
5. The backend extracts the ID from the URL.
6. The model searches `homes.json` for the matching property.
7. The controller receives the selected home.
8. The Home Details page is rendered with the property's information.
9. The user can view the complete details of that property.

## 3. Request-Response Flow

```text id="8zjv6a"
User Home Listing
       |
       v
User clicks Details
       |
       v
GET /user/home-details/:homeId
       |
       v
User Router
       |
       v
getHomeDetails Controller
       |
       v
Extract homeId from req.params
       |
       v
Home.findById(homeId)
       |
       v
Home Model reads homes.json
       |
       v
Find matching home using its ID
       |
       v
Return home through callback
       |
       v
Controller receives the home
       |
       v
Render user/home-detail.ejs
       |
       v
Display selected property's information
```

## 4. Implementation Procedure

### Step 1: Add a Details link to the Home Listing page

Each property card needs a link that directs the user to the details page for that specific property.

The property's ID is passed through the URL.

```ejs
<a href="/user/home-details/<%= home.id %>">
  Details
</a>
```

**Why pass the ID?**

The application needs to know which property the user selected.

Passing the ID allows the backend to retrieve the correct record instead of displaying the same details for every property.

### Step 2: Define the GET route

The user router handles requests for individual home details.

```js
userRouter.get(
  "/user/home-details/:homeId",
  userController.getHomeDetails
);
```

The `:homeId` part is a dynamic route parameter.

For example, if the browser requests:

```text
/user/home-details/0.12345
```

Express makes the value available through:

```js
req.params.homeId
```

The extracted value is `"0.12345"`.

### Step 3: Create the `getHomeDetails` controller

The controller extracts the ID and asks the model to retrieve the corresponding property.

```js
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId, home => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/");
    }

    res.render('user/home-detail', {
      home
    });
  });
};
```

**Understanding the controller:**

- `req.params.homeId` extracts the selected property's ID.
- `Home.findById()` searches for the property.
- The callback receives the matching home.
- The controller checks whether a home was found.
- `res.render()` sends the selected home to the EJS view.

The controller also handles the case where the requested ID does not match any existing property.

### Step 4: Implement `findById()` in the Home model

The model already has a method for retrieving an individual property.

```js
static findById(homeId, callback) {
  this.fetchAll(homes => {
    const homeFound = homes.find(
      home => home.id === homeId
    );

    callback(homeFound);
  });
}
```

**How it works:**

1. `fetchAll()` reads all registered properties from `homes.json`.
2. `find()` searches for a property whose ID matches `homeId`.
3. The matching property is stored in `homeFound`.
4. The callback passes the result back to the controller.

**Why reuse `findById()`?**

The same method can be used by different features that need one specific home.

For example:

- Home Details needs to retrieve a property for displaying its information.
- Edit Home needs to retrieve a property for pre-filling the edit form.

Instead of duplicating the search logic, both features can use the same model method.

### Step 5: Create the Home Details EJS view

Create a separate view for displaying an individual property's information.

```text
views/
    user/
        home-list.ejs
        home-detail.ejs
```

The controller renders this view and passes the selected `home` object to it.

Example:

```ejs
<div class="home-details">

  <img
    src="<%= home.image %>"
    alt="<%= home.houseName %>"
  />

  <h1><%= home.houseName %></h1>

  <p>Location: <%= home.location %></p>

  <p>Price: ₹<%= home.price %></p>

  <p>Rating: <%= home.rating %></p>

</div>
```

**Understanding the view:**

- `home.image` displays the property's image.
- `home.houseName` displays its name.
- `home.location` displays its location.
- `home.price` displays its price.
- `home.rating` displays its rating.

The view receives one home object rather than an array of homes.

## 5. Files Involved

| File | Responsibility |
|---|---|
| User home-list EJS view | Displays property cards and Details links |
| User router | Defines the home details GET route |
| User controller | Extracts the ID, retrieves the property, and renders the view |
| Home model | Implements `findById()` to retrieve one property |
| `views/user/home-detail.ejs` | Displays the selected property's information |
| `data/homes.json` | Stores registered property records |

## 6. Important Concepts Learned

- **Dynamic routes:** Using `:homeId` to identify a specific property.
- **`req.params`:** Extracting values from route parameters.
- **Static model methods:** Calling `Home.findById()` without creating a new Home instance.
- **Array `find()`:** Retrieving one matching record from an array.
- **Callbacks:** Passing the retrieved property from the model to the controller.
- **`res.render()`:** Passing data from the controller to an EJS view.
- **EJS interpolation:** Displaying individual object properties dynamically.
- **Code reuse:** Using the same `findById()` method in multiple features.

## 7. Bugs and Important Lessons

### A. The controller must receive the retrieved home through the callback

An important mistake encountered during implementation was trying to use `home` outside the callback where it was defined.

For example:

```js
Home.findById(homeId, home => {
  console.log(home);
});

res.render('user/home-detail', { home });
```

This causes a `ReferenceError` because the `home` variable exists only inside the callback's scope.

Correct:

```js
Home.findById(homeId, home => {
  res.render('user/home-detail', { home });
});
```

**Lesson:** Variables declared as callback parameters are only available within that callback's scope. Operations that depend on the retrieved data must happen inside it.

### B. Route parameters are strings

Express provides route parameters as strings.

The IDs stored in `homes.json` should therefore also be strings when using strict equality:

```js
home.id === homeId
```

If one ID is stored as a number and the other is a string, the comparison will fail even if their displayed values look identical.

### C. Handle missing properties

The requested ID may not exist in the JSON file.

The controller should check whether `findById()` returned a valid home before attempting to render the details page.

Otherwise, accessing something like `home.houseName` in the EJS view could cause an error.

### D. Understand the difference between `find()` and `filter()`

Both methods search arrays, but they return different results:

| Method | Result |
|---|---|
| `find()` | First matching element |
| `filter()` | New array containing all matching elements |

Since a property ID is intended to identify one home, `find()` is appropriate for this feature.

## 8. Current Limitations and Future Improvements

- **Error handling:** The current implementation redirects when a property is not found. A dedicated 404 page would provide a better experience.
- **Data validation:** The application should ensure that the retrieved property contains valid information before rendering.
- **Booking functionality:** A user could eventually book the property directly from its details page.
- **Favourites:** Users could add or remove the selected property from their favourites.
- **Related properties:** The details page could display other properties in the same location.
- **Authentication:** Some details or actions could eventually depend on whether the user is logged in.
- **Database migration:** A database could retrieve the selected property directly using its ID instead of reading the entire JSON file.

## 9. Final Feature Summary

The Home Details feature demonstrates how an application retrieves and displays one specific record using its unique ID.

The feature follows the MVC pattern:

- The **view** provides a Details link containing the property's ID.
- The **router** directs the GET request to the controller.
- The **controller** extracts the ID and requests the property.
- The **model** searches `homes.json` using `findById()`.
- The **view** displays the retrieved property's information.

The most important learning was understanding how route parameters connect a selected item on one page to the corresponding record on another page.

**Data flow:**

Home Listing → Property ID → Router → Controller → Model → Matching Home → EJS Details Page