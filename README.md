# Sports League Platform

A full-stack web platform for managing local sports leagues, tournaments, teams, and matches.

---

## Overview

This project is a sports league management platform that connects **players** and **organizers** in one centralized system.


## Status
In development... 

### Problem solved

Amateur sports competitions are often managed using disconnected tools (messages, spreadsheets, social media). This platform centralizes everything in one place.

### Target users

* **Players**: join teams, browse matches, participate in tournaments
* **Organizers**: create and manage tournaments, teams, and match schedules

### MVP features

* Authentication system
* Role-based access (Player / Organizer)
* Tournament creation
* Team management
* Join requests system
* Match viewing

---

## Tech Stack

* Next.js (App Router) – Full-stack framework
* Prisma ORM – Type-safe database access
* PostgreSQL (Neon) – Cloud database
* Clerk – Authentication & session management
* TailwindCSS – Styling
* Stripe – Payments (optional / future feature)

---

## Architecture

The project uses a modern full-stack architecture based on **Next.js Server Actions**.

* Server Actions handle backend logic without traditional API routes
* Prisma ensures safe and structured database access
* Clerk manages authentication and user sessions
* Role-based access controls user permissions across the app

---

## Database Model

Main entities:

* User
* Team
* Tournament
* Match
* JoinRequest

### Relationships

* A user can belong to a team
* A team belongs to a tournament
* Join requests connect players to teams
* Matches link teams within tournaments

Prisma ensures relational integrity and consistent data behavior.

---

## User Flow

1. Sign up / login via Clerk
2. Choose role (Player or Organizer)
3. Organizer creates tournaments and teams
4. Players browse teams and tournaments
5. Players send join requests (in progress)
6. Users view matches and team information

---

## Current Status

Some features are still in progress:

* Player team search improvements
* Join request system completion
* Match interaction features

---

## Future Improvements

* Live match updates
* Notifications system
* Advanced tournament brackets
* Payment integration with Stripe
* Player statistics dashboard
