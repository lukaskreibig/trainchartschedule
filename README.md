# Train Schedule Chart

## Overview

The Train Schedule Chart is an advanced web application designed for comprehensive visualization of train schedules. It uniquely combines the strengths of Next.js for server-side rendering and SEO benefits, with React.js for building a dynamic user interface. Leveraging D3.js for sophisticated charting capabilities and employing Material-UI components for a modern and accessible user interface, the application caters to both technical and non-technical users alike. This project features a dual deployment approach: a primary version that integrates with Postgres and is hosted on Supabase with frontend blockchain interactions managed by Drizzle, alongside a local development version that uses SQLite and Node GTFS for direct data importation.

## Versions

- **Deployed Version:** Accessible at [trainchartschedule.vercel.app](https://trainchartschedule.vercel.app), this version stands as the most current iteration, featuring robust data management through Postgres and seamless backend services via Supabase. It further benefits from Drizzle for efficient frontend blockchain interactions, showcasing the full capabilities of the app in a live environment.

- **Local Development Version:** Found on the 'nodegtfs' branch on GitHub, this version is designed for local development. It utilizes SQLite for database management and Node GTFS for straightforward local data importation. Although slightly older, with the caveat that S-Bahn stations are identified by their route_id rather than their actual S-Bahn number.

## Features

- **Dynamic Train Schedule Visualization with D3.js:** Offers interactive, in-depth charting capabilities that transform raw data into engaging visual stories.
- **Interactive Filter Controls for Selecting Apps and Time Ranges:** Enables users to refine what data they see based on their specific interests or requirements.
- **Option to Show or Hide Stations:** Allows for a customized display, focusing attention on the most pertinent information.
- **Responsive and Accessible UI with Material-UI Components:** Ensures that the app is usable across a wide range of devices and accessible to users with different needs.
- **Next.js and React.js Integration:** Utilizes Next.js for enhanced server-side rendering and SEO optimization, paired with React.js for its efficient, component-based UI construction.
- **Postgres, Supabase, and Drizzle Integration:** For the deployed version, ensuring robust data management and interactive capabilities through advanced technology stacks.
- **Local Development Support with SQLite and Node GTFS:** Provides developers with the tools needed for local setup and direct data importation, facilitating ease of development and testing.

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

