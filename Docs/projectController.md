# projectController API Documentation

## Controller: projectController

- **Base URL:** `/api/project`
- **Authorization:** Depends on endpoint

---

### 1. Get Project by ID
- **Name:** GetById
- **Uses:** Get details of a project
- **URL:** `/api/project/{id}`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
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
  "id": 2,
  "nameAr": "مشروع X",
  "nameEn": "Project X",
  "location": "Cairo, Egypt",
  "isAvailable": true
}
```

---

### 2. Get All Projects
- **Name:** GetAll
- **Uses:** List all projects with filter
- **URL:** `/api/project`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** filter params
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "id": 2, "nameAr": "مشروع X", "nameEn": "Project X", "location": "Cairo, Egypt", "isAvailable": true }
]
```

---

### 3. Get Project Locations
- **Name:** GetProjectLocations
- **Uses:** Get all project locations
- **URL:** `/api/project/locations`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "projectId": 2, "latitude": 30.0444, "longitude": 31.2357 }
]
```

---

### 4. Get All Regions
- **Name:** GetAllRegions
- **Uses:** Get all regions
- **URL:** `/api/project/regions`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "regionId": 1, "name": "Cairo" }
]
```

---

### 5. Get All Cities
- **Name:** GetAllCities
- **Uses:** Get all cities
- **URL:** `/api/project/cities`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "cityId": 1, "name": "Cairo" }
]
```

---

### 6. Get All Districts
- **Name:** GetAllDistricts
- **Uses:** Get all districts
- **URL:** `/api/project/districts`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "districtId": 1, "name": "Nasr City" }
]
```

---

### 7. Get All Contact Methods
- **Name:** GetAllContactMethods
- **Uses:** Get all contact methods
- **URL:** `/api/project/contactmethods`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
[
  { "methodId": 1, "type": "Phone", "value": "+20123456789" }
]
```

---

### 8. Get Project Details
- **Name:** GetProjectDetails
- **Uses:** Get details for a specific project
- **URL:** `/api/project/projectdetails/{id}`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - id: int (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "projectId": 2,
  "details": "Full details about project X"
}
```
