# Admin favoritesController API Documentation

## Controller: Admin/favoritesController

- **Base URL:** `/api/admin/favorites`
- **Authorization:** Admin/SuperAdmin

---

### 1. Get All Favorites
- **Name:** GetAllFavorites
- **Uses:** Get all favorite units and projects for all users
- **URL:** `/api/admin/favorites`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  {
    "userId": "123",
    "favoriteUnits": [1,2],
    "favoriteProjects": [2,3]
  }
]
```
