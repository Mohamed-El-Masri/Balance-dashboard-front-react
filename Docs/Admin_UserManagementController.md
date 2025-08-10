# Admin UserManagementController API Documentation

## Controller: Admin/UserManagementController

- **Base URL:** `/api/admin/user-management`
- **Authorization:** Admin/SuperAdmin

---

### 1. Get All Users
- **Name:** GetAllUsers
- **Uses:** Get all users in the system
- **URL:** `/api/admin/user-management`
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
    "id": "123",
    "userName": "user1",
    "email": "user1@example.com",
    "roles": ["User"]
  }
]
```
