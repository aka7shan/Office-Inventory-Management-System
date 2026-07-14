# Office Inventory Management System

Office Inventory Management System is a full-stack order management portal for office supplies. It allows office creators to raise purchase requests with multiple items, and purchasers to process submitted requests offline by completing, rejecting, or sending them back for amendment.

## Features

- Role-based login for Creator, Purchaser, and Manager demo users
- Creator dashboard with personal request visibility
- Purchaser dashboard with submitted and processed request visibility
- Create inventory requests with multiple items and quantities
- Save requests as draft
- Submit requests to purchaser
- Edit only owned draft or sent-back requests
- Complete submitted requests with offline transaction reference
- Reject submitted requests with purchaser note
- Send submitted requests back for creator amendment
- Status-based filtering and search
- Request detail view with creator, item, status, expiry, notes, and transaction details
- File-based H2 database persistence
- CORS configured for frontend/backend local development

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 file-based database
- Maven

## Project Structure

```text
.
├── backend
│   ├── pom.xml
│   └── src/main/java/com/office/inventory
│       ├── config
│       ├── controller
│       ├── dto
│       ├── entity
│       ├── exception
│       ├── repository
│       └── service
└── frontend
    ├── package.json
    └── src
        ├── api
        ├── components
        ├── constants
        ├── data
        ├── styles
        └── utils
```

## Ports

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:8081`
- H2 Console: `http://localhost:8081/h2-console`

## Prerequisites

- Java 17+
- Maven
- Node.js
- npm

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081
```

The backend uses a file-based H2 database:

```text
backend/data/office-inventory
```

H2 console details:

```text
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:file:./data/office-inventory
Username: sa
Password:
```

## Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5174
```

## Default Users

The backend seeds demo users on startup.

| Name | Role | Email |
| --- | --- | --- |
| Akarshan Sharma | Creator | akarshan.creator@office.local |
| Arjun Mehta | Creator | arjun.creator@office.local |
| Priya Nair | Purchaser | priya.purchaser@office.local |
| Sameer Khan | Manager | sameer.manager@office.local |

## Main API Endpoints

```text
GET    /api/users
POST   /api/auth/login
GET    /api/orders
GET    /api/orders/{orderId}
POST   /api/orders?targetStatus=DRAFT|SUBMITTED
PUT    /api/orders/{orderId}?targetStatus=DRAFT|SUBMITTED
POST   /api/orders/{orderId}/complete
POST   /api/orders/{orderId}/reject
POST   /api/orders/{orderId}/send-back
```

Authenticated API calls use a simple demo header:

```text
X-User-Id: u-1001
```

## Business Rules

- Creator can create requests.
- Creator can save requests as draft.
- Creator can edit only their own `DRAFT` or `SENT_BACK` requests.
- Submitted, completed, and rejected requests cannot be edited by creator.
- Purchaser can process only `SUBMITTED` requests.
- Completion requires a transaction reference.
- Rejection and send-back require a note.
- Duplicate items are not allowed inside the same request.
- Two submitted requests cannot contain the same item.
- Draft requests may contain items that appear in other drafts.

## Build Verification

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
mvn test
```

## Notes

This project uses simplified demo authentication through seeded users and an `X-User-Id` header. It is suitable for local assignment/demo usage. A production system would add password-based authentication, JWT/session handling, stronger authorization, audit logging, and database migrations.
