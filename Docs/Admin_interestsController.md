# Admin interestsController API Documentation

## Controller: Admin/interestsController

- **Base URL:** `/api/admin/interests`
- **Authorization:** Admin/SuperAdmin

---

### 1. Get All Interests
- **Name:** GetAllInterests
- **Uses:** Get all interests for all users
- **URL:** `/api/admin/interests`
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
    "interestUnits": [1,2],
    "interestProjects": [2,3]
  }
]
```
