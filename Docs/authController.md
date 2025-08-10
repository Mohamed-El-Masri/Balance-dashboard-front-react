# authController API Documentation

## Controller: authController

- **Base URL:** `/api/auth`
- **Authorization:** Depends on endpoint

---

### 1. Login
- **Name:** Login
- **Uses:** Sign in with email and password
- **URL:** `/api/auth/signin`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Invalid credentials
- **Responses Object (Examples):**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "123",
    "userName": "user1",
    "email": "user@example.com"
  }
}
```

---

### 2. Register
- **Name:** Register
- **Uses:** Create a new user account
- **URL:** `/api/auth/signup`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string",
  "confirmPassword": "string",
  "firstName": "User",
  "lastName": "Test",
  "phoneNumber": "+20123456789"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Error
- **Responses Object (Examples):**
```json
{
  "id": "123",
  "email": "user@example.com",
  "firstName": "User",
  "lastName": "Test"
}
```

---

### 3. Change Password
- **Name:** ChangePassword
- **Uses:** Change user password
- **URL:** `/api/auth/change-password`
- **Method:** POST
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:**
```json
{
  "email": "user@example.com",
  "currentPassword": "oldpass",
  "newPassword": "newpass",
  "confirmNewPassword": "newpass"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Error
- **Responses Object (Examples):**
```json
{
  "message": "Password changed successfully"
}
```

---

### 4. Get Current User Profile
- **Name:** GetCurrentUser
- **Uses:** Get info of authenticated user
- **URL:** `/api/auth/profile`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: User not found
- **Responses Object (Examples):**
```json
{
  "id": "123",
  "userName": "user1",
  "email": "user@example.com",
  "firstName": "User",
  "lastName": "Test"
}
```

---

### 5. Update Profile
- **Name:** UpdateProfile
- **Uses:** Update user profile info
- **URL:** `/api/auth/profile`
- **Method:** PUT
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** (multipart/form-data)
```json
{
  "firstName": "User",
  "lastName": "Test",
  "phoneNumber": "+20123456789",
  "profilePicture": "file"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: User not found
- **Responses Object (Examples):**
```json
{
  "message": "Profile updated successfully"
}
```
