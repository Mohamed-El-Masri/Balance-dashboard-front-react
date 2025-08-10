API Documentation

### Project
API URL: `/api/project`

#### Request
- Method: `GET`
- Headers: Not Required

- Parameters
| Name        | Description                       |
|-------------|-----------------------------------|
| RegionId   | integer($int32)                   |
| (query)    | RegionId                          |
| CityId     | integer($int32)                   |
| (query)    | CityId                            |
| DistrictId | integer($int32)                   |
| (query)    | DistrictId                        |
| IsActive   | boolean                           |
| (query)    | IsActive                          |
| IsFeatured | boolean                           |
| (query)    | IsFeatured                        |
| StatusId   | integer($int32)                   |
| (query)    | StatusId                          |
| TypeId     | integer($int32)                   |
| (query)    | TypeId                            |
| Page       | integer($int32)                   |
| (query)    | Page                              |
| PageSize   | integer($int32)                   |
| (query)    | PageSize                          |

#### Response
- Status: `200 OK`
- Body:
```json
{
  "items": [
    {
      "id": 50,
      "nameAr": "شقة عائلية",
      "nameEn": "Jakubowski LLC",
      "descriptionAr": "تشطيب عالي الجودة ومرافق متكاملة.",
      "descriptionEn": "Error placeat et aut qui. Omnis nihil adipisci. Voluptatem eligendi vero reiciendis inventore saepe officiis ipsam voluptas. Iusto ab quia sit neque esse omnis et. Est exercitationem aut numquam.",
      "locationAr": "Lake Saul",
      "locationEn": "Keeblerview",
      "regionId": null,
      "regionName": null,
      "regionNameEn": null,
      "cityId": null,
      "cityName": null,
      "cityNameEn": null,
      "districtId": null,
      "districtName": null,
      "districtNameEn": null,
      "latitude": -81.3282,
      "longitude": -39.6621,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 1499350,
      "area": 291,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": null,
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://tavares.biz/morph",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 52,
      "nameAr": "فيلا مستقلة",
      "nameEn": "Hilll, Rippin and Kling",
      "descriptionAr": "تتوفر جميع الخدمات في المنطقة المحيطة.",
      "descriptionEn": "Veritatis dignissimos voluptatem. Laudantium quod et magni ullam quia corrupti ipsam est. Velit eum culpa. Culpa quod voluptas eum. Velit distinctio est. Expedita rerum sit architecto sunt velit reiciendis maiores ex.",
      "locationAr": "North Audie",
      "locationEn": "Lake Bretville",
      "regionId": null,
      "regionName": null,
      "regionNameEn": null,
      "cityId": null,
      "cityName": null,
      "cityNameEn": null,
      "districtId": null,
      "districtName": null,
      "districtNameEn": null,
      "latitude": -34.1089,
      "longitude": 22.8528,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 2175802,
      "area": 205,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": null,
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://marie.com/georgia/frozen/overriding",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 67,
      "nameAr": "\tمشروع بالعربي",
      "nameEn": "\tProject in English",
      "descriptionAr": "وصف المشروع بالعربي",
      "descriptionEn": "Project description in English",
      "locationAr": "القاهرة",
      "locationEn": "Cairo",
      "regionId": null,
      "regionName": null,
      "regionNameEn": null,
      "cityId": null,
      "cityName": null,
      "cityNameEn": null,
      "districtId": null,
      "districtName": null,
      "districtNameEn": null,
      "latitude": 30.123456,
      "longitude": 31.987654,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 1500000,
      "area": 250,
      "directLink": null,
      "areaUnitAr": "متر",
      "areaUnitEn": "square meter",
      "mainImageUrl": "https://res.cloudinary.com/dggoycrcv/image/upload/v1753642212/Content/akokboskwf9h9uouzpmu.webp",
      "publicIp": "Content/akokboskwf9h9uouzpmu",
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": null,
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://youtube.com/watch?v=abc123",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 69,
      "nameAr": "\tمشروع بالعربي",
      "nameEn": "\tProject in English",
      "descriptionAr": "وصف المشروع بالعربي",
      "descriptionEn": "Project description in English",
      "locationAr": "القاهرة",
      "locationEn": "Cairo",
      "regionId": 1,
      "regionName": "المنطقة الوسطى",
      "regionNameEn": "Central Region",
      "cityId": 1,
      "cityName": "الرياض",
      "cityNameEn": "Riyadh",
      "districtId": 1,
      "districtName": "النسيم",
      "districtNameEn": "Al Naseem",
      "latitude": 30.123456,
      "longitude": 31.987654,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 1500000,
      "area": 250,
      "directLink": null,
      "areaUnitAr": "متر",
      "areaUnitEn": "square meter",
      "mainImageUrl": "https://res.cloudinary.com/dggoycrcv/image/upload/v1753733253/Content/njy9zv92jyw20dwrkiwl.webp",
      "publicIp": "Content/njy9zv92jyw20dwrkiwl",
      "parkingSpots": 3,
      "elevatorsCount": 5,
      "estimatedCompletionDate": "2025-12-31T00:00:00",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://youtube.com/watch?v=abc123",
      "assignedEmployeeNames": [
        "nada"
      ],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 70,
      "nameAr": "فيلا مستقلة",
      "nameEn": "Hudson Inc",
      "descriptionAr": "تشطيب عالي الجودة ومرافق متكاملة.",
      "descriptionEn": "Illum quam eaque facere. Eligendi voluptate iste assumenda cupiditate. Veritatis est sunt est. Maxime sed sit velit laudantium animi est in sed. Recusandae quia sunt provident esse. Consectetur molestiae incidunt corrupti qui.",
      "locationAr": "Aufderharland",
      "locationEn": "Patsyberg",
      "regionId": 4,
      "regionName": "المنطقة الجنوبية",
      "regionNameEn": "Southern Region",
      "cityId": 1,
      "cityName": "الرياض",
      "cityNameEn": "Riyadh",
      "districtId": 3,
      "districtName": "الشاطئ",
      "districtNameEn": "Al Shatee",
      "latitude": -35.3601,
      "longitude": 170.7021,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 1393030,
      "area": 276,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2026-10-23T09:04:47.1957443",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://flo.biz/armenia",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 71,
      "nameAr": "مشروع فاخر",
      "nameEn": "Bernier and Sons",
      "descriptionAr": "تشطيب عالي الجودة ومرافق متكاملة.",
      "descriptionEn": "Veritatis explicabo sed sint voluptate nesciunt vel ut. Quis ut impedit et. Sint nostrum impedit deserunt assumenda enim aliquam magni.",
      "locationAr": "North Rickyside",
      "locationEn": "Emardchester",
      "regionId": 4,
      "regionName": "المنطقة الجنوبية",
      "regionNameEn": "Southern Region",
      "cityId": 1,
      "cityName": "الرياض",
      "cityNameEn": "Riyadh",
      "districtId": 3,
      "districtName": "الشاطئ",
      "districtNameEn": "Al Shatee",
      "latitude": 30.8467,
      "longitude": -73.4828,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 2646777,
      "area": 233,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2027-04-20T05:52:45.5868111",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://russell.info/islands/matrix/invoice",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 72,
      "nameAr": "مشروع فاخر",
      "nameEn": "Kirlin - Schuster",
      "descriptionAr": "موقع ممتاز ومساحة واسعة.",
      "descriptionEn": "Nihil provident earum nihil alias qui. Iure repudiandae laudantium et voluptatem ad non modi laboriosam. Nulla incidunt ut unde. Est sed hic labore cum facilis maxime facilis.",
      "locationAr": "New Juvenalstad",
      "locationEn": "North Dejonside",
      "regionId": 2,
      "regionName": "المنطقة الغربية",
      "regionNameEn": "Western Region",
      "cityId": 4,
      "cityName": "أبها",
      "cityNameEn": "Abha",
      "districtId": 4,
      "districtName": "المروج",
      "districtNameEn": "Al Muruj",
      "latitude": -61.6239,
      "longitude": 43.2177,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 3034884,
      "area": 192,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2026-09-22T23:22:31.3204699",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://kiel.biz/cotton/orchestrator/dynamic",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 73,
      "nameAr": "استوديو حديث",
      "nameEn": "Thompson - Douglas",
      "descriptionAr": "تتوفر جميع الخدمات في المنطقة المحيطة.",
      "descriptionEn": "Earum facilis voluptatum est quaerat molestiae porro corrupti harum commodi. Non nobis voluptatibus possimus velit. Quia eos quis expedita quia at eos molestias odio.",
      "locationAr": "Estevanview",
      "locationEn": "Trentonport",
      "regionId": 4,
      "regionName": "المنطقة الجنوبية",
      "regionNameEn": "Southern Region",
      "cityId": 1,
      "cityName": "الرياض",
      "cityNameEn": "Riyadh",
      "districtId": 1,
      "districtName": "النسيم",
      "districtNameEn": "Al Naseem",
      "latitude": -76.2175,
      "longitude": 29.8093,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 4101898,
      "area": 183,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2027-01-26T01:23:25.3873741",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://darius.net/hierarchy/estates/west-virginia",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 74,
      "nameAr": "فيلا مستقلة",
      "nameEn": "Fritsch Group",
      "descriptionAr": "تتوفر جميع الخدمات في المنطقة المحيطة.",
      "descriptionEn": "Expedita quod qui. Impedit aut facilis consectetur. Earum ullam sequi dicta. Omnis hic aut minima sit a.",
      "locationAr": "Port Immanuelberg",
      "locationEn": "Port Ned",
      "regionId": 2,
      "regionName": "المنطقة الغربية",
      "regionNameEn": "Western Region",
      "cityId": 2,
      "cityName": "جدة",
      "cityNameEn": "Jeddah",
      "districtId": 3,
      "districtName": "الشاطئ",
      "districtNameEn": "Al Shatee",
      "latitude": 61.7645,
      "longitude": -132.2388,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 2716114,
      "area": 190,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2025-12-10T07:26:22.9506499",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://odell.biz/indexing/consultant",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    },
    {
      "id": 75,
      "nameAr": "فيلا مستقلة",
      "nameEn": "Lesch, Wilderman and Huel",
      "descriptionAr": "وحدة سكنية بتصميم عصري.",
      "descriptionEn": "Alias dolore et. Nam amet voluptatem neque aut quis. Non et perferendis laborum. Blanditiis harum pariatur doloremque est magni eaque ipsum harum. Neque quae nemo et maxime. Iste excepturi sit explicabo et.",
      "locationAr": "East Lucindabury",
      "locationEn": "New Reyes",
      "regionId": 1,
      "regionName": "المنطقة الوسطى",
      "regionNameEn": "Central Region",
      "cityId": 3,
      "cityName": "الدمام",
      "cityNameEn": "Dammam",
      "districtId": 4,
      "districtName": "المروج",
      "districtNameEn": "Al Muruj",
      "latitude": 78.3787,
      "longitude": -123.85,
      "statusId": 1,
      "statusName": "نشط",
      "statusNameEn": "Active",
      "typeId": 6,
      "typeName": "تجاري",
      "typeNameEn": "Commercial",
      "cost": 1098461,
      "area": 99,
      "directLink": null,
      "areaUnitAr": "متر مربع",
      "areaUnitEn": "sq.m",
      "mainImageUrl": null,
      "publicIp": null,
      "parkingSpots": null,
      "elevatorsCount": null,
      "estimatedCompletionDate": "2027-02-21T14:27:41.3715974",
      "countOfUnits": 0,
      "isFeatured": false,
      "isActive": false,
      "youtubeVideoUrl": "https://clotilde.net/forward",
      "assignedEmployeeNames": [],
      "projectsFeaturesIds": [],
      "features": [],
      "imageUrls": []
    }
  ],
  "totalCountOfProjects": 169,
  "totalCountOfFeateredProjects": 79,
  "totalCountAssignedProjectToEmployee": 2,
  "totalCountOfActivedProjects": 118,
  "totalCountOfUnits": 40
}
```

### Get All Regions
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

### . Get All Cities
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

###  Get All Districts
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
