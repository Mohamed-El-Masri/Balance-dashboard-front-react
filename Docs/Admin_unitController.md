# Admin unitController API Documentation

## Controller: Admin/unitController

- **Base URL:** `/api/admin/unit`
- **Authorization:** Admin/SuperAdmin

---

### 1. Create Unit
- **Name:** CreateUnit
- **Uses:** Create a new unit
- **URL:** `/api/admin/unit`
- **Method:** POST
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:**
```json
{
  "titleAr": "وحدة جديدة",
  "titleEn": "New Unit",
  "price": 1000000,
  "area": 120.5
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 201 Created: Success
- **Responses Object (Examples):**
```json
{
  "unitId": 10,
  "message": "Unit created successfully"
}
```
