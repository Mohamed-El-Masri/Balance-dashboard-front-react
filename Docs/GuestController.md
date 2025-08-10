# GuestController API Documentation

## Controller: GuestController

- **Base URL:** `/api/guest`
- **Authorization:** Not required

---

### 1. Browse Public Projects
- **Name:** BrowseProjects
- **Uses:** List all public projects for guests
- **URL:** `/api/guest/projects`
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
  { "id": 2, "nameAr": "مشروع X", "nameEn": "Project X", "location": "Cairo, Egypt", "isAvailable": true }
]
```

---

### 2. Submit Interest Request as Guest
- **Name:** SubmitInterestRequest
- **Uses:** Submit interest request for a project/unit as guest
- **URL:** `/api/guest/interest-request`
- **Method:** POST
- **Header:** None
- **Auth:** Not required
- **Request Body:**
```json
{
  "type": "project",
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
  "message": "Interest request submitted"
}
```
