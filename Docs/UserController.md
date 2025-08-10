# UserController API Documentation

## Controller: UserController

- **Base URL:** `/api/user`
- **Authorization:** Admin/SuperAdmin for most endpoints

---

### 1. Update User
- **Name:** UpdateUser
- **Uses:** Update user information
- **URL:** `/api/user/{id}`
- **Method:** PUT
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Admin/SuperAdmin
- **Request Body:**
```json
{
  "userName": "newUserName",
  "email": "newemail@example.com",
  "phoneNumber": "+20123456789",
  "firstName": "New",
  "lastName": "Name"
}
```
- **Query String:** None
- **Parameters:**
  - id: string (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: User not found
- **Responses Object (Examples):**
```json
{
  "message": "User updated successfully"
}
```

---

### 2. Delete User
- **Name:** DeleteUser
- **Uses:** Delete a user
- **URL:** `/api/user/{id}`
- **Method:** DELETE
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: string (route)
- **Responses Status:**
  - 204 No Content: Success
  - 404 Not Found: User not found
- **Responses Object (Examples):**
```json
{
  "message": "User deleted"
}
```

---

### 3. Assign Role to User
- **Name:** AssignRole
- **Uses:** Assign a role to a user
- **URL:** `/api/user/{id}/assign-role`
- **Method:** POST
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Admin/SuperAdmin
- **Request Body:**
```json
{
  "role": "Admin"
}
```
- **Query String:** None
- **Parameters:**
  - id: string (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: User not found
- **Responses Object (Examples):**
```json
{
  "message": "Role assigned to user"
}
```
