# Train Graph / Bildfahrplan

> **Note:**  
> This demo is experimental and serves as a proof of concept. While it demonstrates the integration and functionality of various technologies, the design and appearance are still a work in progress. Enjoy exploring the functionality, and stay tuned for future improvements!

## Overview

The Train Schedule Chart is a web application for visualizing complex train schedules—commonly known as **train graphs** (or *Bildfahrpläne* in German). These graphs visually represent how trains navigate through a network over time. For additional context, see the [Wikipedia article on Bildfahrplan](https://de.wikipedia.org/wiki/Bildfahrplan).

Currently, the demo uses GTFS data from the S-Bahn in Stuttgart, but the approach is flexible and can be adapted to any GTFS dataset (e.g., long-distance trains or transit systems in other regions).

The application leverages:
- **Next.js** for server-side rendering and improved SEO
- **React.js** for a dynamic, interactive user interface
- **D3.js** for sophisticated, data-driven charting
- **Material-UI** for modern, accessible UI components
- **Drizzle ORM** for streamlined data management with a PostgreSQL database hosted by Supabase

GTFS (General Transit Feed Specification) data is a standardized format comprising multiple CSV files (e.g., `agency.txt`, `stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`) that describe public transit systems. This project imports GTFS data into a Postgres database, processes it, and visualizes the resulting schedule data through interactive charts.

## Versions

- **Deployed Version:**  
  Available on the 'main' branch and hosted at [trainchartschedule-lukaskreibig.vercel.app](https://trainchartschedule-lukaskreibig.vercel.app/). This version uses Postgres (managed via Supabase) with Drizzle ORM, offering the most up-to-date and interactive experience. *(Note: Requires a properly configured GTFS Postgres database.)*

- **Local Development Version:**  
  Available on the 'nodegtfs' branch, this version runs out of the box using SQLite and Node GTFS for local data import. In this version, S-Bahn stations are labeled by their route_id instead of their actual S-Bahn number.

## Features

- **Interactive Train Schedule Visualization:**  
  Uses D3.js to render dynamic, interactive charts.
- **Filter Controls:**  
  Allows users to select specific routes and time ranges to customize the display.
- **Toggle Station Labels:**  
  Users can choose to show or hide station information for clarity.
- **Modern Frontend Stack:**  
  Combines Next.js and React.js for a performant, SEO-friendly user interface.
- **Efficient Data Management:**  
  Drizzle ORM streamlines interactions between the frontend and a PostgreSQL database on Supabase.
- **Flexible GTFS Data Support:**  
  Initially implemented with Stuttgart S-Bahn data, but adaptable to various transit datasets.
- **Robust Testing:**  
  Includes unit tests (using React Testing Library and Jest) to ensure component reliability.

## Prerequisites

Before getting started, ensure you have:
- Node.js (latest stable version recommended)
- npm (included with Node.js)

## Installation

> **Warning:**  
> Only the local development version on the 'nodegtfs' branch runs out of the box without a proper Postgres setup. The Postgres version is more current and includes comprehensive unit tests.

```bash
# Clone the repository:
git clone https://github.com/lukaskreibig/trainchartschedule

# Navigate to the project directory:
cd trainschedulechart

# Install dependencies:
npm install

# Start the development server:
npm run dev

# Run the test suites (Postgres version only):
npm run test
