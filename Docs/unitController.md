# unitController API Documentation

## Controller: unitController

- **Base URL:** `/api/unit`
- **Authorization:** Not required for most endpoints

---

### 1. Get Unit by ID
- **Name:** GetById
- **Uses:** Get details of a unit
- **URL:** `/api/unit/getunit/{id}`
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
  "id": 1,
  "titleAr": "وحدة A",
  "titleEn": "Unit A",
  "descriptionAr": "وصف الوحدة A",
  "descriptionEn": "Unit A description",
  "price": 1000000,
  "area": 120.5,
  "projectId": 2,
  "hasBalcony": true,
  "isFurnished": false,
  "hasParking": true,
  "numberOfBathrooms": 2,
  "status": "Available",
  "type": "Apartment",
  "isActive": true,
  "floor": 3,
  "building": "Building 1",
  "numberOfRooms": 3,
  "latitude": 30.0444,
  "longitude": 31.2357,
  "numberOfBalconies": 1,
  "assignedEmployees": ["emp1", "emp2"],
  "images": [
    { "url": "https://example.com/unit1.jpg" }
  ],
  "unitFeatiureDto": [
    { "featureId": 1, "name": "Feature 1" }
  ],
  "createdAt": "2025-08-09T12:34:56Z"
}
```

---

### 2. Get All Units
- **Name:** GetAll
- **Uses:** List all units with filter
- **URL:** `/api/unit`
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
  { "id": 1, "titleAr": "وحدة A", "titleEn": "Unit A", "price": 1000000, "area": 120.5 }
]
```

---

### 3. Get Available Floors/Rooms/Building for Project
- **Name:** GetAvailableFloors
- **Uses:** Get available floors, rooms, and building info for a project
- **URL:** `/api/unit/projects/{projectId}/floors-numberOfRooms-building`
- **Method:** GET
- **Header:** None
- **Auth:** Not required
- **Request Body:** None
- **Query String:** None
- **Parameters:**
  - projectId: int (route)
- **Responses Status:**
  - 200 OK: Success
- **Responses Object (Examples):**
```json
{
  "floors": [1,2,3],
  "numberOfRooms": [2,3,4],
  "buildings": ["Building 1", "Building 2"]
}
```
