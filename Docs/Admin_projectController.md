# Admin projectController API Documentation

## Controller: Admin/projectController

- **Base URL:** `/api/admin/project`
- **Authorization:** Admin/SuperAdmin

---

### 1. Create Project
- **Name:** CreateProject
- **Uses:** Create a new project
- **URL:** `/api/admin/project`
- **Method:** POST
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:**
```json
{
  "nameAr": "مشروع جديد",
  "nameEn": "New Project",
  "location": "Cairo, Egypt"
}
```
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
  - 201 Created: Success
- **Responses Object (Examples):**
```json
{
  "projectId": 10,
  "message": "Project created successfully"
}
```
