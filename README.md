# Train Schedule Chart

## Overview

The Train Schedule Chart is an innovative web application designed for the comprehensive visualization of train schedules. It combines the power of Next.js for server-side rendering and SEO enhancements with React.js for creating a dynamic user interface. The application uses D3.js for advanced charting capabilities and Material-UI for modern, accessible UI components. A distinctive feature of this project is its use of Drizzle as an ORM (Object-Relational Mapping) tool, facilitating efficient data management and interactions between the application's backend and its Postgres database hosted by Supabase.

## Versions

- **Deployed Version:** Hosted at [trainchartschedule.vercel.app](https://trainchartschedule.vercel.app), this version integrates Postgres for database management, Supabase for backend services, and utilizes Drizzle for ORM, streamlining data interactions and management. It represents the most up-to-date iteration, offering an interactive and seamless user experience.

- **Local Development Version:** Available on the 'nodegtfs' branch, this version is optimized for local approach, using SQLite for database management and Node GTFS for direct local data importation. It's important to note that in this version, S-Bahn stations are labeled by their route_id instead of their actual S-Bahn number.

## Features

- **Dynamic Train Schedule Visualization with D3.js:** Leverages interactive charting to present data in a compelling way.
- **Interactive Filter Controls:** Enables users to select specific apps and time ranges, customizing the data display.
- **Option to Show or Hide Stations:** Provides the ability to customize the display for clarity.
- **Responsive and Accessible Design:** Ensures compatibility across a wide range of devices and accessibility needs with Material-UI components.
- **Next.js and React.js for Frontend Development:** Uses Next.js for server-side rendering and React.js for its component-based UI, enhancing user experience and SEO.
- **Efficient Data Management with Drizzle ORM:** Utilizes Drizzle as an ORM tool for streamlined database interactions, facilitating smooth data retrieval and updates.
- **Support for Postgres and Supabase in the Deployed Version:** Employs robust technologies for database management and backend services.
- **Local Development Support with SQLite and Node GTFS:** Allows for easy setup and testing with direct data importation capabilities.

## Prerequisites

Before starting, ensure you have installed:

- Node.js (latest stable version recommended)
- npm (comes with Node.js)

## Installation

Warning: Only the Local Development Version on the 'nodegtfs' branch will run out of the box without a proper postgres setup.

```bash
# Clone the repository:
git clone https://github.com/lukaskreibig/trainchartschedule

# Navigate to the project directory:
cd trainschedulechart

# Install dependencies:
npm install

# Run:
npm run dev

