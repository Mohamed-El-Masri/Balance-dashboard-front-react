# Admin RolesController API Documentation

## Controller: Admin/RolesController

- **Base URL:** `/api/admin/roles`
- **Authorization:** Admin/SuperAdmin

---

### 1. Assign Role
- **Name:** AssignRole
- **Uses:** Assign a role to a user
- **URL:** `/api/admin/roles/assign`
- **Method:** POST
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:**
```json
{
  "userId": "123",
  "role": "Admin"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Role assigned successfully"
}
```
