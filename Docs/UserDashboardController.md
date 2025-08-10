# UserDashboardController API Documentation

## Controller: UserDashboardController

- **Base URL:** `/api/user/dashboard`
- **Authorization:** Required (Roles: User, Employee, Admin, SuperAdmin)

---

### 1. Get User Profile

- **Name:** GetProfile
- **Uses:** Returns the profile of the authenticated user, including favorites.
- **URL:** `/api/user/dashboard/profile`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
	- 200 OK: Success
	- 401 Unauthorized: If user is not authenticated
	- 404 Not Found: If user profile not found
- **Responses Object (Examples):**

```json
{
	"id": "123",
	"userName": "JohnDoe",
	"email": "john@example.com",
	"phoneNumber": "+20123456789",
	"firstName": "John",
	"lastName": "Doe",
	"bio": "Real estate enthusiast",
	"whatsAppNumber": "+20123456789",
	"location": "Cairo, Egypt",
	"profilePictureUrl": "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
	"isActive": true,
	"lastLoginAt": "2025-08-09T12:34:56Z",
	"roleNames": ["User"],
	"favoritesProject": [
		{
			"projectId": 2,
			"nameAr": "مشروع X",
			"nameEn": "Project X",
			"isAvailable": true
		}
	],
	"favoritesUnit": [
		{
			"unitId": 1,
			"nameAr": "وحدة A",
			"nameEn": "Unit A",
			"isAvailable": true
		}
	]
}
```

---

### 2. Get User Interest Requests

- **Name:** GetInterestRequests
- **Uses:** Returns all interest requests submitted by the authenticated user.
- **URL:** `/api/user/dashboard/interest-requests`
- **Method:** GET
- **Header:** `Authorization: Bearer <token>`
- **Auth:** Required
- **Request Body:** None
- **Query String:** None
- **Parameters:** None
- **Responses Status:**
	- 200 OK: Success
	- 401 Unauthorized: If user is not authenticated
	- 404 Not Found: If no interest requests found
- **Responses Object (Examples):**

```json
[
	{
		"requestId": "req1",
		"type": "unit",
		"unit": {
			"unitId": 1,
			"nameAr": "وحدة A",
			"nameEn": "Unit A",
			"isAvailable": true
		},
		"status": "Pending"
	},
	{
		"requestId": "req2",
		"type": "project",
		"project": {
			"projectId": 2,
			"nameAr": "مشروع X",
			"nameEn": "Project X",
			"isAvailable": true
		},
		"status": "Approved"
	}
]
```
