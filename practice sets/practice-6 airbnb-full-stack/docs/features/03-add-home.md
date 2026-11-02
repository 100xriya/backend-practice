# Add Home Feature

## 1. Objective

The Add Home feature allows a host to register a new property in the Airbnb application.

The host fills out a form containing the property's information, such as its name, price, location, rating, and image URL.

When the form is submitted, the backend receives the form data, creates a new `Home` object, generates a unique ID, and saves the property in `homes.json`.

Once saved, the host is redirected to the Host Home List, where the newly registered property can be viewed.

## 2. User Workflow

1. The host opens the application and selects the option to share a property.
2. The application displays the Add Home form.
3. The host enters the property details:
   - House name
   - Price
   - Location
   - Rating
   - Image URL
4. The host submits the form.
5. The browser sends a POST request containing the submitted form data.
6. The backend receives the data through `req.body`.
7. The controller creates a new `Home` object.
8. The model generates an ID and saves the new property in `homes.json`.
9. The host is redirected to the Host Home List.
10. The newly registered property appears in the listing.

## 3. Request-Response Flow

### A. Loading the Add Home form

```text
Host selects Add Home
        |
        v
GET /host/add-home
        |
        v
Host Router
        |
        v
getAddHome Controller
        |
        v
Render host/add-home.ejs
        |
        v
Add Home form displayed
```

### B. Submitting the Add Home form

```text
Host fills out the form
        |
        v
Submits the form
        |
        v
POST /host/add-home
        |
        v
Host Router
        |
        v
postAddHome Controller
        |
        v
Extract values from req.body
        |
        v
Create new Home object
        |
        v
Home.save()
        |
        v
Home Model fetches existing homes
        |
        v
Generate a new ID
        |
        v
Push new Home object into array
        |
        v
Write updated array to homes.json
        |
        v
Redirect to Host Home List
        |
        v
New property displayed
```

## 4. Implementation Procedure

### Step 1: Create the Add Home view

Create an EJS view for the host to enter the property details.

```text
views/
    host/
        add-home.ejs
```

The form contains input fields for the information required to register a property.

Example:

```ejs
<form action="/host/add-home" method="POST">

  <input
    type="text"
    name="houseName"
    placeholder="Enter house name"
  />

  <input
    type="number"
    name="price"
    placeholder="Enter price"
  />

  <input
    type="text"
    name="location"
    placeholder="Enter location"
  />

  <input
    type="text"
    name="image"
    placeholder="Enter image URL"
  />

  <button type="submit">Add Home</button>

</form>
```

The rating field can also be implemented using radio buttons.

**Important:** Each input needs a `name` attribute. Express uses these names as keys when constructing the submitted `req.body` object.

### Step 2: Define the GET route

The host router handles requests to open the Add Home page.

```js
hostRouter.get(
  "/host/add-home",
  addHostController.getAddHome
);
```

This route directs the request to the controller responsible for displaying the form.

### Step 3: Create the GET controller

The controller renders the Add Home view.

```js
exports.getAddHome = (req, res, next) => {
  res.render('host/add-home', {
    editing: false
  });
};
```

The `editing: false` value indicates that the form is being used to register a new property rather than edit an existing one.

This becomes useful because the same form is reused by the Edit Home feature.

### Step 4: Configure form-data parsing in Express

For Express to read submitted URL-encoded form data, the application needs the appropriate middleware.

In `app.js`:

```js
app.use(express.urlencoded());
```

This middleware parses the incoming form data and makes it available through:

```js
req.body
```

Without this middleware, the controller would not receive the expected parsed form values.

### Step 5: Define the POST route

The host router needs a POST route to receive the submitted form.

```js
hostRouter.post(
  "/host/add-home",
  addHostController.postAddHome
);
```

The GET route displays the form, while the POST route processes its submitted data.

### Step 6: Create the POST controller

The controller extracts the submitted values, creates a new `Home` object, and calls its `save()` method.

```js
exports.postAddHome = (req, res, next) => {
  const {
    houseName,
    price,
    location,
    rating,
    image
  } = req.body;

  const home = new Home(
    houseName,
    price,
    location,
    rating,
    image
  );

  home.save();

  res.redirect('/host/host-home-list');
};
```

**Understanding the controller:**

- `req.body` contains the submitted form data.
- Destructuring extracts the individual values.
- `new Home()` creates an instance of the Home model.
- `home.save()` asks the model to persist the new property.
- `res.redirect()` sends the host back to the listing page.

The controller coordinates the operation, while the model handles the actual data storage.

### Step 7: Create the Home model

The `Home` class represents a property in the application.

Its constructor receives the property details and assigns them to the object.

```js
module.exports = class Home {
  constructor(houseName, price, location, rating, image) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.image = image;
  }
};
```

For example:

```js
const home = new Home(
  "Mountain View Villa",
  2500,
  "Manali",
  "⭐⭐⭐⭐",
  "https://example.com/image.jpg"
);
```

This creates a JavaScript object representing the new property.

### Step 8: Implement the `save()` method

The model handles adding the new property to the existing collection.

```js
save() {
  Home.fetchAll(registeredHomes => {
    if (this.id) {
      registeredHomes = registeredHomes.map(home => {
        if (home.id === this.id) {
          return this;
        }

        return home;
      });
    } else {
      this.id = Math.random().toString();
      registeredHomes.push(this);
    }

    const homeDataPath = path.join(
      rootDir,
      'data',
      'homes.json'
    );

    fs.writeFile(
      homeDataPath,
      JSON.stringify(registeredHomes),
      err => {
        if (err) console.log('Error saving home:', err);
      }
    );
  });
}
```

**How the Add Home operation works:**

1. `fetchAll()` retrieves the existing property records.
2. The model checks whether the current object already has an ID.
3. Since a newly registered home does not have an ID, it enters the `else` branch.
4. A new ID is generated.
5. `push()` adds the new object to the existing array.
6. `fs.writeFile()` writes the updated array to `homes.json`.

The same `save()` method also supports Edit Home, where an existing ID causes the update branch to execute.

### Step 9: Store the property in `homes.json`

The JSON file acts as the application's data store.

After a successful registration, the new property is added to the existing collection.

Example:

```json
[
  {
    "id": "0.12345",
    "houseName": "Mountain View Villa",
    "price": 2500,
    "location": "Manali",
    "rating": "⭐⭐⭐⭐",
    "image": "https://example.com/image.jpg"
  }
]
```

The actual file can contain multiple property objects.

The application reads this file later when displaying the Home Listing and Home Details pages.

## 5. Files Involved

# File => Responsibility 

1. Host router -> Defines GET and POST Add Home routes |
2. Host controller -> Displays the form and processes submitted data |
3. Home model->| Represents a property and implements `save()` |
4. `views/host/add-home.ejs` -> Displays the property registration form |
5. `app.js`-> Configures URL-encoded form parsing middleware |
6. `data/homes.json` -> Stores registered properties |

## 6. Important Concepts Learned

- **GET vs POST:** GET displays the form, while POST processes its submitted data.
- **HTML forms:** Collecting user input and sending it to the server.
- **Input `name` attributes:** Defining the keys used in `req.body`.
- **Express middleware:** Parsing URL-encoded form submissions.
- **`req.body`:** Accessing submitted form data.
- **Destructuring:** Extracting multiple values from an object.
- **Classes and constructors:** Representing a property using a `Home` instance.
- **Instance methods:** Calling `home.save()` on a particular Home object.
- **Callbacks:** Waiting for asynchronous file reading before adding a property.
- **JSON serialization:** Converting JavaScript data into JSON using `JSON.stringify()`.
- **File-system operations:** Persisting data using `fs.writeFile()`.

## 7. Bugs and Important Lessons

### A. Form inputs need `name` attributes

An input may be visible in the browser, but without a `name` attribute, its value will not be included in the normal form submission.

For example:

```html
<input type="text" placeholder="House name">
```

This input does not provide a key for Express to use in `req.body`.

Correct:

```html
<input
  type="text"
  name="houseName"
  placeholder="House name"
>
```

### B. Configure `express.urlencoded()`

The application must parse URL-encoded form submissions before the controller tries to access `req.body`.

This is why middleware is configured in `app.js`.

### C. Do not expect `save()` to return the saved array

The model reads the existing homes asynchronously.

The new property is added inside the `fetchAll()` callback, not immediately when `save()` is called.

### D. Generate an ID for every new property

The ID allows the application to identify a particular home for features such as:

- Home Details
- Edit Home
- Delete Home
- Favourites

Without a unique identifier, managing individual property records becomes difficult.

The current implementation uses:

```js
this.id = Math.random().toString();
```

This is suitable for the small learning project, but a stronger ID-generation approach should be used in a production application.

### E. Avoid overwriting existing records

When registering a new property, the model must first retrieve the existing array and then append the new property.

Writing only the new object to the JSON file would overwrite the previously registered homes.

### F. Understand asynchronous redirects

The current controller calls `home.save()` and redirects immediately.

Because `save()` uses asynchronous file operations, the redirect does not guarantee that the write has completed.

A more robust implementation should make `save()` report completion through a callback or Promise and redirect only after successful persistence.

## 8. Current Limitations and Future Improvements

- **Validation:** Validate property names, prices, locations, ratings, and image URLs on the server.
- **Error handling:** Return file-writing errors to the controller instead of only logging them.
- **ID generation:** Use a stronger unique identifier such as `crypto.randomUUID()`.
- **Image handling:** Support image uploads rather than relying only on externally supplied image URLs.
- **Authentication:** Only authenticated hosts should be allowed to register properties.
- **Ownership:** Associate every property with its host.
- **Database migration:** Replace JSON file storage with a database as the application grows.
- **Form feedback:** Display success or error messages after form submission.

## 9. Final Feature Summary

The Add Home feature demonstrates how data submitted through an HTML form travels through an Express application and becomes persistent application data.

The feature follows the MVC pattern:

- The **view** collects property information through an HTML form.
- The **router** directs GET and POST requests.
- The **controller** receives the submitted values and creates a Home object.
- The **model** generates an ID and saves the new property.
- The **JSON file** stores the registered property.

The most important learning was understanding the complete form-submission flow:

**HTML Form → POST Request → Express Middleware → Controller → Model → JSON File**

This feature also provides the foundation for Home Listing, Home Details, Edit Home, and Delete Home.