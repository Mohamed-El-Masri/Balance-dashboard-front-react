# NotificationController API Documentation

## Controller: NotificationController

- **Base URL:** `/api/notification`
- **Authorization:** Admin/SuperAdmin/User for most endpoints

---

### 1. Get Notification by ID
- **Name:** GetById
- **Uses:** Get details of a notification
- **URL:** `/api/notification/{id}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin/User
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "id": 1,
  "title": "Notification Title",
  "message": "Notification message",
  "isRead": false
}
```

---

### 2. Get All Notifications
- **Name:** GetAll
- **Uses:** List all notifications with filter
- **URL:** `/api/notification`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin/User
- **Request Body:** None
- **Query String:** filter params
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "id": 1, "title": "Notification 1", "message": "Msg 1", "isRead": false },
  { "id": 2, "title": "Notification 2", "message": "Msg 2", "isRead": true }
]
```

---

### 3. Create Notification
- **Name:** Create
- **Uses:** Add new notification
- **URL:** `/api/notification`
- **Method:** POST
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:**
```json
{
  "title": "Notification Title",
  "message": "Notification message"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "id": 1
}
```

---

### 4. Mark Notification as Read
- **Name:** MarkAsRead
- **Uses:** Mark notification as read
- **URL:** `/api/notification/{id}/mark-as-read`
- **Method:** POST
- **Header:** None
- **Auth:** User
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "message": "Notification marked as read"
}
```

---

### 5. Delete Notification
- **Name:** Delete
- **Uses:** Remove a notification
- **URL:** `/api/notification/{id}`
- **Method:** DELETE
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 204 No Content: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "message": "Notification deleted"
}
```
