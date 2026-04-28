# Organization Hierarchy API

A production-ready RESTful API for managing organization employee hierarchy with unlimited depth levels, built with NestJS, TypeORM, and PostgreSQL.

## 🏗️ Architecture
┌─────────────────────────────────────────────┐
│ API Layer (Controllers) │
├─────────────────────────────────────────────┤
│ Service Layer (Business) │
├─────────────────────────────────────────────┤
│ Repository Layer (Data Access) │
├─────────────────────────────────────────────┤
│ PostgreSQL Database │
└─────────────────────────────────────────────┘

## 🚀 Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.x | Backend framework |
| TypeORM | 0.3.x | ORM for database |
| PostgreSQL | 14+ | Relational database |
| Swagger | 7.x | API documentation |
| Jest | 29.x | Unit testing |

## 📋 Features

- ✅ **CRUD Operations** - Create, read, update, delete positions
- ✅ **Hierarchical Tree** - Get unlimited depth organization tree
- ✅ **Smart Deletion** - Auto re-parenting of children when parent deleted
- ✅ **Circular Reference Prevention** - Cannot set descendant as parent
- ✅ **Input Validation** - DTO validation with class-validator
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Unit Tests** - Controller tests with 12 passing tests

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Rediet-Geremew/perago-nestjs-api.git
cd perago-nestjs-api

# Install dependencies
npm install

# Set up environment variables
# Create .env file with your database credentials

# Start development server
npm run start:dev
