# Edit Home Feature

## 1. Objective

The Edit Home feature allows a host to modify the details of a property they have already registered.

Instead of creating a new property, the application retrieves the existing home using its unique ID, displays its current information in an editable form, and saves the updated information while preserving the original ID.

The feature also reuses the existing Add Home form, avoiding the need to create a completely separate form for editing.

## 2. User Workflow

1. The host opens the Host Home List.
2. The host clicks the Edit button on a property.
3. The application identifies the selected property using its ID.
4. The backend retrieves the existing property from `homes.json`.
5. The Edit Home page opens with the existing property details already filled in.
6. The host modifies the required information.
7. The host submits the form.
8. The backend receives the updated information along with the original home ID.
9. The model updates the matching property in `homes.json`.
10. The host is redirected to the Host Home List.

## 3. Request-Response Flow

### A. Loading the Edit Home page

```text
Host Home List
      |
      v
Host clicks Edit
      |
      v
GET /host/edit-home/:homeId?editing=true
      |
      v
Host Router
      |
      v
getEditHome Controller
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
Return home to Controller
      |
      v
Render edit-home.ejs with existing data
      |
      v
Form displays current property details
```

### B. Submitting the updated form

```text
Host modifies property details
      |
      v
Submits Edit Home form
      |
      v
POST /host/edit-home
      |
      v
Host Router
      |
      v
postEditHome Controller
      |
      v
Extract form data, including original ID
      |
      v
Create updated Home object
      |
      v
Home.save()
      |
      v
Fetch all existing homes
      |
      v
Replace matching home using its ID
      |
      v
Write updated array to homes.json
      |
      v
Redirect to /host/host-home-list
```

## 4. Implementation Procedure

### Step 1: Add the Edit button to the Host Home List

Each property needs an Edit button that sends its unique ID to the backend.

The ID is passed as a route parameter.

```ejs
<a href="/host/edit-home/<%= home.id %>?editing=true">
  Edit
</a>
```

The URL contains two different kinds of information:

- `home.id` is a route parameter identifying the property.
- `editing=true` is a query parameter indicating that the form is being used in editing mode.

### Step 2: Define the GET route

The host router handles requests for the Edit Home page.

```js
hostRouter.get(
  "/host/edit-home/:homeId",
  addHostController.getEditHome
);
```

The router passes the request to the `getEditHome` controller.

### Step 3: Create the GET controller

The controller extracts the home ID and checks whether the request is for editing.

```js
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId, home => {
    if (!home) {
      console.log("Home not found in list for editing");
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home,
      editing,
      homeId
    });
  });
};
```

**Understanding the controller:**

- `req.params.homeId` retrieves the selected property's ID from the URL.
- `req.query.editing` retrieves the editing mode from the query string.
- `Home.findById()` retrieves the corresponding property.
- `res.render()` sends the retrieved property to the EJS view.

The controller also checks whether the property exists. If it doesn't, the user is redirected instead of attempting to render a form with missing data.

### Step 4: Implement `findById()` in the Home model

The model is responsible for retrieving the selected property.

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
2. `find()` searches the array for the property whose ID matches `homeId`.
3. The matching property is passed to the controller through the callback.

**Why use `find()`?**

Unlike `filter()`, which returns an array of matching elements, `find()` returns the first matching element.

Since each ID should identify one property, `find()` is suitable here.

### Step 5: Reuse the Add Home form for editing

Instead of maintaining two separate forms, the existing form can be reused for both adding and editing properties.

The form's action changes depending on the `editing` variable.

```ejs
<form
  action="/host/<%= editing ? 'edit-home' : 'add-home' %>"
  method="POST"
>
```

When `editing` is true, the form submits to `/host/edit-home`.

When `editing` is false, it submits to `/host/add-home`.

### Step 6: Pre-fill the form with existing property details

The controller passes the existing `home` object to the EJS view.

The view uses its properties as the input values.

For example:

```ejs
<input
  type="text"
  name="houseName"
  value="<%= editing ? home.houseName : '' %>"
/>

<input
  type="text"
  name="price"
  value="<%= editing ? home.price : '' %>"
/>

<input
  type="text"
  name="location"
  value="<%= editing ? home.location : '' %>"
/>
```

This allows the host to see the current information and modify it.

The same approach can be used for other fields, such as the image URL and rating.

### Step 7: Preserve the original home ID

One important requirement is that editing must update the existing property instead of creating a new one.

To achieve this, a hidden input sends the original ID along with the form submission.

```ejs
<input
  type="hidden"
  name="id"
  value="<%= editing ? home.id : '' %>"
/>
```

**Why is this necessary?**

The ID is not something the host needs to edit, but the backend needs it to identify which existing record should be updated.

The hidden input makes the ID part of the submitted form data.

### Step 8: Define the POST route

The host router handles the submitted edit form.

```js
hostRouter.post(
  "/host/edit-home",
  addHostController.postEditHome
);
```

This route receives the updated property information.

### Step 9: Create the POST controller

The controller extracts the submitted values, creates a new `Home` object, assigns the original ID, and calls `save()`.

```js
exports.postEditHome = (req, res, next) => {
  const {
    id,
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

  home.id = id;

  home.save();

  res.redirect('/host/host-home-list');
};
```

**Important details:**

- `req.body` contains the submitted form data.
- A new `Home` object is created using the updated values.
- `home.id = id` preserves the identity of the existing property.
- `home.save()` handles the update.
- The controller redirects the host to the listing page.

The original ID is what distinguishes an edit operation from a new home registration.

### Step 10: Modify the `save()` method to support editing

The existing `save()` method originally handled adding new homes.

It needed to be extended so that it could also update an existing home.

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

**Understanding the update logic:**

The model first fetches all existing properties.

It then checks whether the current `Home` object already has an ID.

**If an ID exists:**

The operation is treated as an update.

`map()` iterates over all existing homes:

- If an existing home's ID matches `this.id`, it returns the updated object (`this`).
- Otherwise, it returns the original home unchanged.

**If an ID does not exist:**

The operation is treated as a new registration.

- A new ID is generated.
- The new home is added using `push()`.

Finally, the updated array is written back to `homes.json`.

This allows the same `save()` method to support both adding and editing.

## 5. Files Involved

| File | Responsibility |
|---|---|
| Host home-list EJS view | Displays the Edit link and selected home ID |
| Host router | Defines GET and POST edit routes |
| Host controller | Retrieves the home and handles submitted updates |
| Home model | Implements `findById()` and the update logic in `save()` |
| Edit Home EJS view | Displays the pre-filled form |
| `data/homes.json` | Stores the updated property records |

## 6. Important Concepts Learned

- **Route parameters (`req.params`):** Identifying which property should be edited.
- **Query parameters (`req.query`):** Determining whether the form is in editing mode.
- **`find()`:** Retrieving a single matching property from an array.
- **EJS rendering:** Passing data from the controller to the view.
- **Conditional rendering:** Reusing one form for both Add and Edit operations.
- **Hidden inputs:** Sending an ID that the user doesn't need to modify.
- **`req.body`:** Receiving submitted form data.
- **Array `map()`:** Replacing one record while retaining the others.
- **Model reuse:** Extending the existing `save()` method instead of creating a completely separate update mechanism.

## 7. Bugs and Important Lessons

### A. Missing `return` inside the `map()` callback

One of the important mistakes encountered during implementation was forgetting to return the original home when its ID didn't match.

Incorrect:

```js
registeredHomes = registeredHomes.map(home => {
  if (home.id === this.id) {
    return this;
  }
});
```

The callback returns `undefined` for every nonmatching home.

When the array is converted to JSON, those undefined array entries become `null`, potentially corrupting the stored data.

Correct:

```js
registeredHomes = registeredHomes.map(home => {
  if (home.id === this.id) {
    return this;
  }

  return home;
});
```

**Lesson:** Every element needs to be returned from the `map()` callback if it should remain in the resulting array.

### B. Preserve the original ID

If the submitted form doesn't include the original ID, the model cannot identify which record should be updated.

The operation may then be treated as a new home registration.

This is why the hidden input is important.

### C. Keep ID types consistent

Express route parameters and submitted form values are strings.

The IDs stored in `homes.json` should also be strings when using strict equality:

```js
home.id === this.id
```

Inconsistent ID types can cause a valid property to go unmatched.

### D. Correct the POST route path

The route must begin with `/`:

```js
hostRouter.post("/host/edit-home", ...);
```

A missing leading slash can result in an incorrectly registered route.

### E. Check that the home exists

Before rendering the edit form, the controller should check whether `findById()` actually found a record.

Otherwise, attempting to access properties of an undefined home can cause an error.

## 8. Current Limitations and Future Improvements

- **Validation:** The backend should validate submitted values rather than relying only on HTML form validation.
- **Ownership checks:** A host should only be able to edit properties they are authorized to manage. This will become important when authentication and multiple users are implemented.
- **Error handling:** The controller currently redirects immediately after calling `home.save()`. A more robust implementation should wait for the file-writing operation to finish and handle errors before redirecting.
- **Missing record handling:** The model could return a clear result when the supplied ID doesn't match any existing property.
- **ID generation:** `Math.random()` is adequate for this small learning exercise, but a stronger ID-generation approach should be used in a larger application.
- **Database migration:** When moving to a database, the update operation can use a database-specific update query rather than rewriting the entire JSON file.

## 9. Final Feature Summary

The Edit Home feature demonstrates how an existing record can be retrieved, displayed in a form, modified, and saved without creating a duplicate.

The feature follows the MVC pattern:

- The **view** sends the selected home ID and displays existing information.
- The **router** directs GET and POST requests.
- The **controller** retrieves the property and handles the submitted form.
- The **model** searches for the property and updates the matching record.
- The **JSON file** stores the updated information.

The most important learning was understanding how the original ID travels from the Edit button, into the form, through the POST request, and finally into the model, where it determines which record gets replaced.