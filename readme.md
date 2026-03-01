# URL Shortener – Microservices Architecture (Design + Folder Structure)

This document gives you:

1. **High‑level architecture**
2. **Responsibilities of each service**
3. **Inter‑service communication**
4. **Recommended folder structure (monorepo)**
5. **Database & caching strategy**
6. **Request flows (create & redirect)**
7. **Scalability & production notes**

The design is language‑agnostic, but examples assume **Node.js + TypeScript** (easy to adapt to Go/Java).

---

## 1. High‑Level Architecture

```
Client
  │
  ▼
API Gateway
  │
  ├──► Auth Service
  │
  ├──► URL Shortener Service ───► Cache Service ───► DB Service
  │
  ├──► Redirect Service ─────────► Cache Service ───► DB Service
  │
  └──► ZooKeeper (Coordination)
```

---

## 2. Services & Responsibilities

### 2.1 API Gateway

**Purpose**: Single entry point

**Responsibilities**:

* Request routing
* Authentication verification (JWT)
* Rate limiting
* API versioning
* Request logging

**Does NOT**:

* Business logic
* Database access

---

### 2.2 Auth Service

**Purpose**: Identity & access control

**Responsibilities**:

* User signup/login
* JWT issuing & validation
* API key management

**Storage**:

* Users table
* Refresh tokens

---

### 2.3 URL Shortener Service

**Purpose**: Create short URLs

**Responsibilities**:

* Generate unique short codes
* Validate long URLs
* Store mappings
* Handle custom aliases

**Key APIs**:

```
POST /shorten
```

---

### 2.4 Redirect Service

**Purpose**: Fast redirection

**Responsibilities**:

* Resolve short code → long URL
* Increment analytics counters
* Handle expiration

**Key APIs**:

```
GET /{shortCode}
```

⚠️ This service must be **ultra‑fast**.

---

### 2.5 Database Service

**Purpose**: Data abstraction layer

**Responsibilities**:

* CRUD for URLs
* Analytics storage
* Hide DB implementation from services

**Why separate?**

* Easier DB migration
* Strong boundary

---

### 2.6 Cache Service

**Purpose**: High‑speed access

**Responsibilities**:

* Cache shortCode → longURL
* Cache hot URLs
* TTL management

**Implementation**:

* Redis / KeyDB

---

### 2.7 ZooKeeper Service

**Purpose**: Distributed coordination

**Responsibilities**:

* Unique ID generation
* Leader election
* Configuration management

**Used for**:

* Short code generation without collision
* Service discovery (optional)

---

## 3. Inter‑Service Communication

| Type                   | Usage                            |
| ---------------------- | -------------------------------- |
| HTTP/REST              | External + simple internal calls |
| gRPC                   | High‑performance internal calls  |
| Async (Kafka/RabbitMQ) | Analytics, logs                  |

---

## 4. Monorepo Folder Structure (Recommended)

```
url-shortener/
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── index.ts
│   └── Dockerfile
│
├── auth-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── index.ts
│   └── Dockerfile
│
├── url-shortener-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── shortCodeGenerator.ts
│   │   ├── repositories/
│   │   ├── dto/
│   │   └── index.ts
│   └── Dockerfile
│
├── redirect-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── cache/
│   │   └── index.ts
│   └── Dockerfile
│
├── cache-service/
│   ├── src/
│   │   ├── redisClient.ts
│   │   └── index.ts
│   └── Dockerfile
│
├── database-service/
│   ├── src/
│   │   ├── models/
│   │   ├── migrations/
│   │   ├── repositories/
│   │   └── index.ts
│   └── Dockerfile
│
├── zookeeper-service/
│   ├── config/
│   └── scripts/
│
├── shared/
│   ├── proto/
│   ├── utils/
│   └── constants/
│
├── docker-compose.yml
├── k8s/
│   ├── deployments/
│   ├── services/
│   └── ingress/
│
└── README.md
```

---

## 5. Database Design

### URLs Table

```
id (uuid)
short_code (unique)
long_url
user_id
created_at
expires_at
```

### Analytics Table

```
short_code
ip_address
timestamp
user_agent
```

---

## 6. Caching Strategy

### Read Path (Redirect)

1. Check Redis
2. If miss → DB
3. Store in Redis (TTL)

### Write Path (Shorten)

1. Write to DB
2. Write to Cache

---

## 7. Request Flows

### Create Short URL

```
Client
 → API Gateway
 → Auth Service (JWT check)
 → URL Shortener Service
 → ZooKeeper (ID)
 → DB Service
 → Cache Service
```

### Redirect

```
Client
 → API Gateway
 → Redirect Service
 → Cache Service
 → DB Service (if cache miss)
 → 302 Redirect
```

---

## 8. Scalability Notes

* Stateless services
* Horizontal scaling
* Redis cluster
* DB sharding by shortCode
* CDN for redirects

gi