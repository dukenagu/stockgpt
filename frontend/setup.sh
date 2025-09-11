#!/bin/bash

# Install dependencies
npm install

# Build Tailwind CSS
npx tailwindcss -i ./src/styles/App.css -o ./src/styles/tailwind.css --watch

# Start development server
npm start