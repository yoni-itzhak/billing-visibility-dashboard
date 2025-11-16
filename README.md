# Billing Visibility Dashboard

A modern, well-structured React + TypeScript dashboard for visualizing credits consumption and billing data.

## Features

- **Interactive Charts**: Visualize credits consumption over time with Chart.js
- **Alerts System**: Real-time alerts with severity levels and mitigation
- **File Details**: View detailed file consumption data in flat table or grouped by meter
- **Advanced Filtering**: Filter by file name, type, action type, connector, and more
- **Sorting**: Sort table data by any column
- **Period Selection**: View data for 24h, 7d, 30d, or 90d periods
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Chart.js 2** - React wrapper for Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── Dashboard.tsx    # Main dashboard container
  │   ├── Controls.tsx     # Customer/org/period controls
  │   ├── AlertsSection.tsx # Alerts display
  │   ├── StatsSection.tsx # Total credits display
  │   ├── CreditsChart.tsx # Chart visualization
  │   ├── FileDetails.tsx  # File details container
  │   ├── FlatView.tsx     # Flat table view
  │   ├── GroupedView.tsx  # Grouped by meter view
  │   ├── Dropdown.tsx     # Reusable dropdown component
  │   └── MultiSelect.tsx  # Multi-select component
  ├── data/                # Mock data
  │   └── mockData.ts      # Sample data for demo
  ├── types/               # TypeScript type definitions
  │   └── index.ts         # All type definitions
  ├── utils/               # Utility functions
  │   └── dataGenerator.ts # Data generation logic
  ├── App.tsx              # Root component
  ├── main.tsx             # Entry point
  └── index.css            # Global styles
```

## Key Components

### Dashboard
Main container that orchestrates all sub-components and manages state.

### CreditsChart
Interactive bar chart showing credits consumption over time. Click on bars to view details for that date.

### FileDetails
Displays detailed file consumption data with two view modes:
- **Flat View**: All files in a sortable, filterable table
- **Grouped View**: Files organized by meter type with expandable sections

### AlertsSection
Shows active alerts filtered by the selected period. Alerts can be mitigated.

## Development

The project uses:
- **ESLint** for code linting
- **TypeScript** strict mode for type checking
- **Tailwind CSS** for styling

Run linting:
```bash
npm run lint
```

## License

MIT

