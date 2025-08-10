# TaskController API Documentation

## Controller: TaskController

- **Base URL:** `/api/task`
- **Authorization:** Admin/SuperAdmin/Employee for most endpoints

---

### 1. Get Task by ID
- **Name:** GetById
- **Uses:** Get details of a task
- **URL:** `/api/task/{id}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin/Employee
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
  "title": "Task Title",
  "description": "Task description",
  "assignedToId": "123",
  "status": 0,
  "dueDate": "2025-08-10T00:00:00Z"
}
```

---

### 2. Get All Tasks
- **Name:** GetAll
- **Uses:** List all tasks with filter
- **URL:** `/api/task`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin/Employee
- **Request Body:** None
- **Query String:** filter params
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "id": 1, "title": "Task 1", "description": "Desc 1", "status": 0, "dueDate": "2025-08-10T00:00:00Z" }
]
```

---

### 3. Create Task
- **Name:** Create
- **Uses:** Add new task
- **URL:** `/api/task`
- **Method:** POST
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "assignedToId": "123",
  "status": 0,
  "dueDate": "2025-08-10T00:00:00Z"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 201 Created: Success
- **Responses Object (Examples):**
```json
{
  "id": 1
}
```

---

### 4. Update Task
- **Name:** Update
- **Uses:** Update details of a task
- **URL:** `/api/task/{id}`
- **Method:** PUT
- **Header:** None
- **Auth:** Admin/SuperAdmin/Employee
- **Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": 1
}
```
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 204 No Content: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "message": "Task updated successfully"
}
```

---

### 5. Delete Task
- **Name:** Delete
- **Uses:** Remove a task
- **URL:** `/api/task/{id}`
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
  "message": "Task deleted"
}
```

---

### 6. Assign Task to Employee
- **Name:** AssignToEmployee
- **Uses:** Assign a task to an employee
- **URL:** `/api/task/{id}/assign-employee`
- **Method:** POST
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:**
```json
{
  "employeeId": "456"
}
```
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "message": "Task assigned to employee"
}
```

---

### 7. Set Status for Task
- **Name:** SetStatus
- **Uses:** Set status for a task
- **URL:** `/api/task/{id}/set-status?status=int`
- **Method:** POST
- **Header:** None
- **Auth:** Admin/SuperAdmin/Employee
- **Request Body:** None
- **Query String:** `status=int`
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
  - 404 Not Found: Not found
- **Responses Object (Examples):**
```json
{
  "message": "Task status updated"
}
```
