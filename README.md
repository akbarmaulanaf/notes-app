# Dicoding Notes App

A simple web application for taking notes, powered by the Dicoding Notes API. This application allows users to:

- Create new notes
- View a list of notes (both active and archived)
- Archive and unarchive notes
- Delete notes
- Search through notes

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install the dependencies:

```bash
npm install
```

### Running the App

To run the app in development mode:

```bash
npm run start-dev
```

This will start the development server with hot reload enabled. Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### Building for Production

To build the app for production:

```bash
npm run build
```

This will create a `dist` folder with the optimized and bundled files ready for deployment.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Web Components
- Webpack
- Babel

## API

This application uses the [Dicoding Notes API](https://notes-api.dicoding.dev/v2) for managing notes.
