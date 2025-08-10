# EmployeeDashboardController API Documentation

## Controller: EmployeeDashboardController

- **Base URL:** `/api/employee/dashboard`
- **Authorization:** Employee only

---

### 1. Get Assigned Items
- **Name:** GetAssignedItems
- **Uses:** Get all items assigned to the employee
- **URL:** `/api/employee/dashboard/assigned-items`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required (Employee)
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 401 Unauthorized: Not logged in
- **Responses Object (Examples):**
```json
[
  { "itemId": 1, "title": "Item 1", "status": "Assigned" },
  { "itemId": 2, "title": "Item 2", "status": "Assigned" }
]
```

---

### 2. Get Employee Tasks
- **Name:** GetTasks
- **Uses:** Get all tasks assigned to the employee
- **URL:** `/api/employee/dashboard/tasks`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required (Employee)
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
  - 401 Unauthorized: Not logged in
- **Responses Object (Examples):**
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Description for task 1",
    "status": 0,
    "dueDate": "2025-08-10T00:00:00Z"
  }
]
```
