# FavoritesController API Documentation

## Controller: favoritesController

- **Base URL:** `/api/favorites`
- **Authorization:** Depends on endpoint

---

### 1. Add Favorite Unit
- **Name:** SubmitInterest (Unit)
- **Uses:** Add a unit to favorites
- **URL:** `/api/favorites/unit`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "unitId": 1
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Unit added to favorites"
}
```

---

### 2. Remove Favorite Project
- **Name:** RemoveProjectInterest
- **Uses:** Remove a project from favorites
- **URL:** `/api/favorites/project`
- **Method:** PUT
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** `projectId=int`
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Interest removed successfully."
}
```

---

### 3. Add Favorite Project
- **Name:** SubmitInterest (Project)
- **Uses:** Add a project to favorites
- **URL:** `/api/favorites/project`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "projectId": 2
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Project added to favorites"
}
```

---

### 4. Get All Favorites for User
- **Name:** GetAll
- **Uses:** Get all favorite units and projects for a user
- **URL:** `/api/favorites/user-units-projects/{userId}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - userId: string (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "userId": "123",
  "favoriteUnits": [1,2],
  "favoriteProjects": [2,3]
}
```

---

### 5. Get Favorite Units for User
- **Name:** GetUserInterest
- **Uses:** Get all favorite units for a user
- **URL:** `/api/favorites/unit/{userId}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - userId: string (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "userId": "123",
  "favoriteUnits": [1,2]
}
```

---

### 6. Remove Favorite Unit
- **Name:** RemoveUnitInterest
- **Uses:** Remove a unit from favorites
- **URL:** `/api/favorites/unit`
- **Method:** PUT
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** `unitId=int`
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Unit removed from favorites."
}
```
