# Home Listing Feature

## 1. Objective

The Home Listing feature displays the properties registered in the Airbnb application.

It allows users to browse available homes and allows hosts to view the properties they have registered.

The application retrieves the property records from `data/homes.json`, passes them from the model to the controller, and renders them dynamically using EJS.

Instead of manually writing property cards in HTML, the application generates them based on the data stored in the JSON file.

## 2. User Workflow

### User Home List

1. The user opens the application.
2. The application loads the home listing page.
3. The backend retrieves all registered homes from `homes.json`.
4. The controller passes the retrieved data to the EJS view.
5. EJS iterates over the homes and displays each property as a card.
6. The user can browse the available properties and proceed to view individual home details.

### Host Home List

1. The host selects the option to manage or share a property.
2. The application opens the Host Home List.
3. The backend retrieves the registered homes.
4. The controller passes the data to the host listing view.
5. EJS displays the registered properties.
6. The host can manage properties using actions such as Edit and Delete.

## 3. Request-Response Flow

### A. User Home List

```text
User opens application
        |
        v
GET /
        |
        v
User Router
        |
        v
getHome Controller
        |
        v
Home.fetchAll()
        |
        v
Home Model reads homes.json
        |
        v
Return registeredHomes through callback
        |
        v
Controller receives the array
        |
        v
res.render('user/home-list', { registeredHomes })
        |
        v
EJS iterates over registeredHomes
        |
        v
Property cards displayed to user
```

### B. Host Home List

```text
Host opens Host Home List
        |
        v
GET /host/host-home-list
        |
        v
Host Router
        |
        v
Host Home List Controller
        |
        v
Home.fetchAll()
        |
        v
Home Model reads homes.json
        |
        v
Return registeredHomes through callback
        |
        v
Controller passes data to EJS
        |
        v
Host listing view displays property cards
        |
        v
Edit and Delete actions available
```

## 4. Implementation Procedure

### Step 1: Create the home listing views

Separate views are maintained for users and hosts.

```text
views/
    user/
        home-list.ejs

    host/
        host-home-list.ejs
```

The user view is intended for browsing properties, while the host view is intended for managing registered properties.

Both views can display property information using the same underlying home data.

### Step 2: Define the user home listing route

The user router handles the request to open the home listing page.

```js
userRouter.get("/", userController.getHome);
```

When the user visits the root route, Express directs the request to the `getHome` controller.

### Step 3: Create the `getHome` controller

The controller requests all registered homes from the model.

```js
exports.getHome = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
    res.render('user/home-list', {
      registeredHomes
    });
  });
};
```

**Understanding the controller:**

- `Home.fetchAll()` retrieves all stored home records.
- The callback receives the resulting array as `registeredHomes`.
- `res.render()` renders the EJS template.
- The object passed to `res.render()` makes `registeredHomes` available inside the EJS view.

### Step 4: Implement `fetchAll()` in the Home model

The model is responsible for reading the property data from the JSON file.

```js
static fetchAll(callback) {
  const homeDataPath = path.join(
    rootDir,
    'data',
    'homes.json'
  );

  fs.readFile(homeDataPath, (err, data) => {
    if (!err) {
      callback(JSON.parse(data));
    } else {
      callback([]);
    }
  });
}
```

**How it works:**

1. `path.join()` constructs the path to `homes.json`.
2. `fs.readFile()` asynchronously reads the file.
3. If reading succeeds, `JSON.parse()` converts the JSON text into a JavaScript array.
4. The array is passed to the controller through the callback.
5. If reading fails, an empty array is returned.

**Why use a callback?**

`fs.readFile()` is asynchronous. The model cannot assume that the file contents will be available immediately after calling it.

The callback ensures the controller receives the data after the read operation completes.

### Step 5: Display the homes dynamically using EJS

The controller passes `registeredHomes` to the EJS view.

The view can then iterate over the array to generate property cards.

Example:

```ejs
<% registeredHomes.forEach(home => { %>

  <div class="home-card">
    <img src="<%= home.image %>" alt="<%= home.houseName %>">

    <h2><%= home.houseName %></h2>

    <p><%= home.location %></p>

    <p>₹<%= home.price %></p>

    <p><%= home.rating %></p>
  </div>

<% }) %>
```

**Understanding EJS:**

- `<% ... %>` executes JavaScript without directly displaying its result.
- `<%= ... %>` evaluates an expression and outputs its value.
- `forEach()` iterates over every property in the array.

This means the number of property cards depends on the number of records in `homes.json`.

When a new property is registered, it can appear in the listing without manually adding another card to the HTML.

### Step 6: Load the Host Home List

The host listing follows the same general process:

1. The host router receives the request.
2. The host controller calls `Home.fetchAll()`.
3. The model retrieves the records.
4. The controller passes the array to the host EJS view.
5. The host view displays the registered properties.

The host listing can also include Edit and Delete forms or links for each property.

This reuses the same data retrieval method rather than implementing a separate JSON-reading operation.

## 5. Files Involved

# File -> Responsibility 

1. User router -> Defines the user home listing route  
2. User controller -> Retrieves homes and renders the user listing |
3. Host router -> Defines the host home listing route |
4. Host controller -> Retrieves homes and renders the host listing |
5. Home model -> Reads all registered homes from JSON |
6. `views/user/home-list.ejs` -> Displays properties for users |
7. `views/host/host-home-list.ejs` -> Displays properties for hosts |
8. `data/homes.json` -> Stores registered property records |

## 6. Important Concepts Learned

- **MVC architecture:** Separating routing, request handling, data operations, and presentation.
- **Static model methods:** Calling `Home.fetchAll()` without creating a new Home instance.
- **Asynchronous file reading:** Understanding why `fs.readFile()` uses a callback.
- **JSON parsing:** Converting stored JSON text into JavaScript data.
- **Callbacks:** Passing retrieved data from the model to the controller.
- **`res.render()`:** Sending data from the controller to an EJS template.
- **EJS iteration:** Dynamically generating multiple property cards.
- **Code reuse:** Using one model method to retrieve data for multiple views.

## 7. Bugs and Important Lessons

### A. Assigning the result of an asynchronous function to a variable

An important mistake encountered during development was treating `Home.fetchAll()` as if it immediately returned the array.

Incorrect:

```js
const registeredHomes = Home.fetchAll();
```

This doesn't work because `fetchAll()` performs an asynchronous file read and provides its result through a callback.

The variable does not automatically receive the array.

Correct:

```js
Home.fetchAll(registeredHomes => {
  res.render('user/home-list', {
    registeredHomes
  });
});
```

**Lesson:** When a function provides data through a callback, use that data inside the callback rather than expecting an immediate return value.

### B. Understanding the difference between the model and controller

The model should handle reading the JSON file.

The controller should decide what to do with the retrieved data, such as rendering the home listing page.

Keeping these responsibilities separate makes the application easier to maintain.

### C. Returning an empty array when reading fails

The current `fetchAll()` implementation returns an empty array if the file cannot be read.

This prevents the controller from receiving `undefined` in that situation.

However, it can also hide the actual cause of the problem. A missing file and a genuine file permission error should ideally be handled differently.

### D. Dynamic rendering instead of hardcoded cards

Hardcoding individual property cards would mean manually changing the view whenever a new home is registered.

Using EJS iteration makes the listing data-driven.

The view remains the same while the contents of `homes.json` change.

## 8. Current Limitations and Future Improvements

- **Error handling:** Instead of treating every file-reading error as an empty array, the model should distinguish between a missing file and other errors.
- **Data validation:** The application should ensure that stored home records contain the required fields before rendering them.
- **Filtering and sorting:** Users could filter properties by location, price, or rating.
- **Search:** A search feature could help users find properties.
- **Pagination:** If the number of properties grows, displaying everything on one page may become inefficient.
- **User-specific host listings:** Currently, the application uses a shared home collection. With authentication, each host should see and manage only their own properties.
- **Database migration:** A database can eventually replace JSON file storage as the number of records and users increases.

## 9. Final Feature Summary

The Home Listing feature demonstrates how stored data is retrieved and dynamically displayed in an application.

The feature follows the MVC pattern:

- The **router** receives the request to open the listing.
- The **controller** requests the registered homes and renders the appropriate view.
- The **model** reads the property records from `homes.json`.
- The **view** uses EJS to generate property cards dynamically.

The most important learning was understanding the complete data flow:

**JSON file → Model → Callback → Controller → EJS View → Browser**

This same data retrieval process can be reused by other features, including home details, favourites, editing, and host property management.