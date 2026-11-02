# Delete Home Feature

## 1. Objective

The Delete Home feature allows a host to remove a previously registered property from the Airbnb application.

When the host clicks the **Delete** button on a property card, the application identifies that property using its unique ID, removes the matching record from `homes.json`, and redirects the host to the home listing page.

## 2. User Workflow

1. The host opens the Host Home List.
2. Each registered property is displayed with a Delete button.
3. The host clicks Delete on the property they want to remove.
4. The browser sends a POST request containing the property's ID.
5. The backend identifies the matching property.
6. The property is removed from `homes.json`.
7. The host is redirected to the Host Home List, where the deleted property should no longer appear.

## 3. Request-Response Flow

Host Home List
      |
      v
Host clicks Delete
      |
      v
POST /host/delete-home/:homeId
      |
      v
Host Router
      |
      v
postDeleteHome Controller
      |
      v
Home.deleteById(homeId)
      |
      v
Home Model reads homes.json
      |
      v
Filter out the matching home
      |
      v
Write updated array to homes.json
      |
      v
Callback returns
      |
      v
Redirect to /host/host-home-list
      |
      v
Updated Host Home List

## 4. Implementation Procedure

### Step 1: Add a Delete form to the home listing

The Delete button needs to submit a POST request to the backend.

The form includes the home's ID in its URL so that the server knows which property to delete.

```ejs
<form action="/host/delete-home/<%= home.id %>" method="POST">
  <button type="submit">Delete</button>
</form>
```

**Why POST?**

Deleting a record changes application data. We use a POST request here to trigger that operation rather than using a normal link, which would send a GET request.

### Step 2: Define the route

In the host router, define the POST route:

```js
hostRouter.post(
  "/host/delete-home/:homeId",
  addHostController.postDeleteHome
);
```

**Why `:homeId`?**

The colon defines a route parameter. Express extracts the value from the URL and makes it available through:

```js
req.params.homeId
```

For example, a request to `/host/delete-home/0.12345` gives the controller the ID `"0.12345"`.

### Step 3: Create the controller

The controller receives the request, extracts the ID, and calls the model method.

```js
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.deleteById(homeId, (error) => {
    if (error) {
      return next(error);
    }

    res.redirect('/host/host-home-list');
  });
};
```

**Controller responsibilities:**

- Extract the home ID from the request.
- Ask the model to delete the corresponding record.
- Handle any error returned by the model.
- Redirect after the deletion operation completes.

The redirect belongs inside the callback because file writing is asynchronous. Redirecting immediately after calling the model could send the response before the file has been updated.

### Step 4: Implement deletion in the model

The model handles the actual data manipulation.

```js
static deleteById(homeId, callback) {
  this.fetchAll(homes => {
    const updatedHomes = homes.filter(
      home => home.id !== homeId
    );

    const homeDataPath = path.join(
      rootDir,
      'data',
      'homes.json'
    );

    fs.writeFile(
      homeDataPath,
      JSON.stringify(updatedHomes),
      callback
    );
  });
}
```

**How does this work?**

1. `fetchAll()` reads the existing property records from `homes.json`.
2. `filter()` creates a new array containing every property except the one