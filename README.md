# Enterprise SaaS Manager Platform

A production-ready Multi-Tenant SaaS Boilerplate built with **.NET 8/10**, **React (Vite)**, and **SQL Server**. 
Engineered with Clean Architecture, Domain-Driven Design principles, and fully containerized with Docker.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

## 🚀 Features

### Backend (.NET API)
- **Multi-Tenancy:** Strict data isolation using TenantID filters at the database level.
- **Security:** JWT Authentication with Role-Based Access Control (SuperAdmin vs. Manager).
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, API).
- **Observability:** Immutable Audit Logging for compliance.
- **Background Jobs:** Decoupled Email Service interface.

### Frontend (React + TypeScript)
- **Modern Stack:** Vite, Tailwind CSS 3.4.
- **UI System:** Custom "Midnight Indigo" design system.
- **Data Layer:** Centralized Axios instance with automatic Token Injection.
- **Responsiveness:** Mobile-first dashboard design.

### Infrastructure (Docker)
- **Orchestration:** `docker-compose` setup for API, Client, and SQL Server.
- **Database:** Automatic seeding of Admin User and Tenants on startup.

---

## 🛠️ Tech Stack

- **Core:** .NET 8 / C# 12
- **Database:** SQL Server 2022
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Containerization:** Docker & Docker Compose
- **Testing:** Swagger/OpenAPI

---

## ⚡ Quick Start (Docker)

The easiest way to run the entire stack is with Docker.

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/EnterpriseSaaSManager.git](https://github.com/YOUR_USERNAME/EnterpriseSaaSManager.git)
   cd EnterpriseSaaSManager