# interestsController API Documentation

## Controller: interestsController

- **Base URL:** `/api/interests`
- **Authorization:** Depends on endpoint

---

### 1. Add Interest Unit
- **Name:** SubmitInterest (Unit)
- **Uses:** Add interest for a unit
- **URL:** `/api/interests/unit`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "unitId": 1
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Interest added for unit"
}
```

---

### 2. Remove Interest Project
- **Name:** RemoveProjectInterest
- **Uses:** Remove interest for a project
- **URL:** `/api/interests/project`
- **Method:** DELETE
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** `projectId=int`
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Interest removed for project."
}
```

---

### 3. Add Interest Project
- **Name:** SubmitInterest (Project)
- **Uses:** Add interest for a project
- **URL:** `/api/interests/project`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "projectId": 2
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Interest added for project"
}
```

---

### 4. Get All Interests for User
- **Name:** GetAll
- **Uses:** Get all interests for a user
- **URL:** `/api/interests/user-units-projects/{userId}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - userId: string (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "userId": "123",
  "interestUnits": [1,2],
  "interestProjects": [2,3]
}
```

---

### 5. Get Interest Units for User
- **Name:** GetUserInterest
- **Uses:** Get all interest units for a user
- **URL:** `/api/interests/unit/{userId}`
- **Method:** GET
- **Header:** None
- **Auth:** Admin/SuperAdmin
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - userId: string (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "userId": "123",
  "interestUnits": [1,2]
}
```

---

### 6. Remove Interest Unit
- **Name:** RemoveUnitInterest
- **Uses:** Remove interest for a unit
- **URL:** `/api/interests/unit`
- **Method:** DELETE
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** `unitId=int`
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "message": "Interest removed for unit."
}
```
