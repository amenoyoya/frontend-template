# Vite + Tailwind + TinyMCE

## Environment

- Node.js: 12.18.2
    - Yarn package manager: 1.22.4
- Shell: bash
- Browser: Google Chrome

### Framework
- Vite.js:
    - An opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
    - Lightning fast cold server start
    - Instant hot module replacement (HMR)
    - True on-demand compilation
- Tailwind.css:
    - Instead of opinionated predesigned components, Tailwind provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.
    - Responsive to the core
    - Component-friendly
    - Designed to be customized

### Structure
```bash
./
|_ backend/ # http://localhost:3333
|  |_ api/
|  |  |_ index.js # API definition => /api/***
|  |
|  |_ public/ # Static files => /***
|  |  |_ index.html
|  |
|  |_ main.js # Backend express server
|
|_ frontend/ # http://localhost:3000/
   |_ public/ # Static files => /***
   |  |_ js/
   |     |_ tinymce
   |        |_ tinymce.min.js
   |        :
   |
   |_ src/
   |  |_ assets/
   |  |  |_ tailwind.css # Tailwind.css importer
   |  |
   |  |_ App.vue # Vue.js entry point: load from ../index.html
   |
   |_ index.html # Frontend entry point
```

### Setup
```bash
# install node_modules
## yarn && yarn --cwd backend && yarn --cwd frontend
$ yarn setup

# start servers
## frontend (vite): http://localhost:3000
## backend (express): http://localhost:3333
$ yarn start
```
