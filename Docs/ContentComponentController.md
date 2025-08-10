# ContentComponentController API Documentation

## Controller: ContentComponentController

- **Base URL:** `/api/contentcomponent`
- **Authorization:** Admin/SuperAdmin for most endpoints

---

### 1. Get Content Component by ID
- **Name:** GetById
- **Uses:** Get details of a content component
- **URL:** `/api/contentcomponent/{id}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
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
  "title": "Component Title",
  "description": "Component description"
}
```

---

### 2. Get All Content Components
- **Name:** GetAll
- **Uses:** List all content components with filter
- **URL:** `/api/contentcomponent`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** filter params
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "id": 1, "title": "Component 1", "description": "Desc 1" },
  { "id": 2, "title": "Component 2", "description": "Desc 2" }
]
```

---

### 3. Create Content Component
- **Name:** Create
- **Uses:** Add new content component
- **URL:** `/api/contentcomponent`
- **Method:** POST
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** (multipart/form-data)
```json
{
  "title": "Component Title",
  "description": "Component description"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Component created successfully"
}
```

---

### 4. Update Content Component
- **Name:** Update
- **Uses:** Update details of a content component
- **URL:** `/api/contentcomponent/{id}`
- **Method:** PUT
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** (multipart/form-data)
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Content component updated successfully."
}
```

---

### 5. Delete Content Component
- **Name:** Delete
- **Uses:** Remove a content component
- **URL:** `/api/contentcomponent/{id}`
- **Method:** DELETE
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Component deleted successfully"
}
```
