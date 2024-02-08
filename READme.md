# BookBuddy API

## Backend server for the BookBuddy app with auth and mongoose relationships etc.

## Entities
```js
User is comprised of the following:

    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    token: String,
```
```js
Book is comprised of the following:

    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
    },
    published: {
        type: Date,
        required: true,
        
    },
    authers: [authorSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
```
```js
Author is comprised of the following:

    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
    }
```
### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

## routes

### Books routes
| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET   | `/books`             | `books#index`    |
| GET   | `/books/:id`             | `books#show`    |
| POST   | `/books`             | `books#create`    |
| PATCH  | `/books/:id` | `books#update`  |
| DELETE | `/books/:id`        | `books#delete`   |

### Author Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/authors/:bookId`         | `authors#create`    |
| PATCH  | `/authors/:bookId/:authorId`  | `authors#update`  |
| DELETE | `/authors/:bookId/:authorId`  | `authors#delete`   |

