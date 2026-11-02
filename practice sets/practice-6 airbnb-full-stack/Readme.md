# Airbnb — Full-Stack Web Application

An Airbnb-inspired full-stack web application built with **Node.js, Express.js, and EJS**. This project focuses on learning backend development, MVC architecture, server-side rendering, routing, and persistent data storage.

The application provides two entry points: **User** and **Host**. Visitors first select how they want to use the application and are then redirected to the corresponding interface.

Users can explore homes, view property details, manage favourites, and manage bookings. Hosts can add, edit, and delete property listings.

## Features

### Role Selection
- Landing page with two choices: **I'm here to explore** (User) and **I have a place to share** (Host).
- Redirects users to the appropriate interface based on their selected role.
- Separate user and host views and routes.

### User Features
- **Browse Homes:** Explore available property listings.
- **Home Details:** View individual property information.
- **Favourites:** Add homes to and remove homes from a favourites list.
- **Bookings:** Book homes, view booked homes, and remove bookings.

### Host Features
- **Add Home:** Create new property listings.
- **Edit Home:** Update existing property information.
- **Delete Home:** Remove property listings.

### Application Features
- MVC-inspired application structure.
- Server-side rendering with EJS templates.
- Dynamic routing using URL parameters.
- Persistent data storage using JSON files.
- Separate user and host interfaces.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework and routing |
| EJS | Server-side templating |
| HTML5 | Application structure |
| Tailwind CSS | Styling |
| JavaScript | Application logic |
| JSON | Data storage |
| Node.js File System (`fs`) | Reading and writing application data |

## Project Structure

```text
airbnb-full-stack/
│
├── controller/
│   ├── userController.js
│   └── hostController.js
│
├── models/
│   ├── home.js
│   ├── favourite.js
│   └── bookings.js
│
├── routes/
│   ├── userRouter.js
│   └── hostRouter.js
│
├── views/
│   ├── user/
│   ├── host/
│   └── roles.ejs
│
├── data/
│   ├── homes.json
│   ├── favourite.json
│   └── bookings.json
│
├── Utils/
│   └── pathUtil.js
│
├── docs/
│   └── features/
│       ├── 01-home-listing.md
│       ├── 02-home-details.md
│       ├── 03-add-home.md
│       ├── 04-edit-home.md
│       ├── 05-delete-home.md
│       ├── 06-favourites.md
│       ├── 07-remove-favorites.md
│       └── 08-booking-list.md
│
├── app.js
├── index.js
├── package.json
└── README.md
```

## Application Flow

When the application starts, visitors are presented with a role-selection page.

```text
              Application
                   |
                   v
             Role Selection
                   |
          +--------+--------+
          |                 |
          v                 v
        User               Host
          |                 |
          v                 v
     User Pages         Host Pages
          |                 |
          v                 v
 Browse Homes          Manage Homes
 View Details          Add Home
 Favourites            Edit Home
 Bookings              Delete Home
```

## Application Architecture

The project follows the **Model-View-Controller (MVC)** architectural pattern to separate application responsibilities.

```text
           Client Request
                 |
                 v
               Router
                 |
                 v
             Controller
                 |
                 v
               Model
                 |
                 v
          JSON File Storage
                 |
                 v
             Controller
                 |
                 v
              EJS View
                 |
                 v
           Client Response
```

### Models
Handle application data and file operations.

- `Home`: Manages property listings, including creating, retrieving, updating, and deleting homes.
- `Favourite`: Manages favourite home IDs.
- `Bookings`: Manages booked home IDs.

### Controllers
Handle incoming requests, interact with models, and determine the appropriate response.

### Routes
Define application endpoints and connect them to controller methods.

### Views
EJS templates render dynamic pages using data passed from controllers.

## Data Storage

The project currently uses JSON files for persistent storage instead of a database.

| File | Stores |
|---|---|
| `homes.json` | Complete property listing objects |
| `favourite.json` | Array of favourite home IDs |
| `bookings.json` | Array of booked home IDs |

Favourite and booking records store home IDs separately from the actual property data. The application retrieves the corresponding home objects when displaying these lists.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed.
- npm (included with Node.js).
- Git (optional, for cloning the repository).

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/100xriya/backend-practice/tree/airbnb-dynamic-styling/practice%20sets
```

**2. Navigate to the project directory**

```bash
cd airbnb-full-stack
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the application**

```bash
npm start
```

**5. Open in your browser**

[http://localhost:3000/roles](http://localhost:3000/roles)

## Learning Outcomes

This project helped me develop practical experience with:

- Understanding Node.js and Express.js request-response cycles.
- Structuring backend applications using MVC architecture.
- Creating and organizing Express routers and controllers.
- Working with dynamic routes and URL parameters.
- Handling HTML form submissions using GET and POST requests.
- Using EJS to render dynamic server-side content.
- Performing asynchronous file operations using Node.js `fs`.
- Implementing CRUD operations.
- Working with callbacks and asynchronous execution.
- Separating application data into reusable models.
- Managing related data using IDs and array methods such as `find()`, `filter()`, and `includes()`.

## Current Limitations

This is a learning project, and some features are intentionally simplified.

- JSON files are used instead of a database.
- Role selection is implemented, but authentication and authorization are not.
- User-specific data management is not yet implemented; favourites and bookings currently use shared JSON-file storage.
- Bookings are stored as home IDs rather than complete reservation records.
- Booking dates, availability management, and payment processing are not implemented.
- Production-level validation and security measures are still to be developed.

## Future Improvements

- Integrate MongoDB for database persistence.
- Implement user authentication and authorization.
- Associate homes, favourites, and bookings with individual users.
- Introduce proper reservation records and availability management.
- Improve validation and error handling.
- Add automated testing.
- Build a React frontend.

## Documentation

Feature-specific implementation notes and request flows are available in the [`docs/features/`](./docs/features/) directory.

| Document | Feature |
|---|---|
| `01-home-listing.md` | Home listing |
| `02-home-details.md` | Home details |
| `03-add-home.md` | Add home |
| `04-edit-home.md` | Edit home |
| `05-delete-home.md` | Delete home |
| `06-favourites.md` | Add and display favourites |
| `07-remove-favorites.md` | Remove favourites |
| `08-booking-list.md` | Booking operations |

These documents explain how individual features work, including their EJS forms, routes, controllers, models, data flow, and debugging lessons.

---

**Status:** Ongoing learning and portfolio project.