Executive Summary & Problem Statement
Details the agricultural supply chain dilemma where intermediaries capture 40–60% of produce margins.
Outlines how AgriConnect delivers +20% to +25% higher net realization to farmers and ~18% savings to consumers with 24–48 hour direct farm logistics.

Full Technology Breakdown
Database: Relational SQL & MySQL 8.0 DDL with normalized schemas, constraints, foreign keys, and indexes.
In-Browser SQL Engine: AlaSQL with local storage persistence.
Frontend Stack: React 19, TypeScript, Tailwind CSS v4, and Bootstrap-inspired responsive grid systems.
Package & Tools: Vite, Lucide React, Canvas Confetti, and JSZip.

Complete MySQL Relational Schema Architecture
Full entity-relationship ASCII diagram showing tables:
users (credentials, contact details, GitHub handle, RBAC roles)
farmers (farm cooperative name, GPS location, land acreage, NPOP organic certification, rating, UPI ID)
crops (varieties, harvest dates, stock quantities, pricing, shelf-life)
orders (contracts, tracking status, escrow payment status)
order_items (crop references, weights in kg, unit price locks)
reviews (verified 1–5 star ratings and written comments)
payments (gateway authorization refs, escrow clearance)
market_prices (government APMC Mandi wholesale benchmarks)
crop_inquiries (wholesale bidding and custom bulk negotiations)

Detailed Feature Documentation
Direct Farm-to-Consumer Marketplace with category, price, and organic filters.
Farmer Hub & Inventory Management (CRUD, stock deductions, harvest dates).
Customer Star Rating & Review System with automated rating recalculation.
Escrow Payment Vault (UPI, Cards, Net Banking, and Escrow COD).
Real-Time APMC Mandi Market Intelligence.
Interactive SQL Terminal with pre-built query library and CSV/SQL dump export.
Complete ZIP Codebase Export and GitHub Account Linking.

Quickstart & Deployment Guide
Step-by-step local installation (npm install && npm run dev).
Instructions to import the database dump into local MySQL (mysql -u root -p agriconnect < agriconnect_schema.sql).
Git repository push instructions for GitHub (git remote add origin https://github.com/...).
