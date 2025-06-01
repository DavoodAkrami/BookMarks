# BookMarks - React Bookmark Management Application

A modern, responsive web application for managing your bookmarks with a clean, macOS-inspired design. Built with React and Vite, this application allows users to create, edit, and delete bookmarks with a beautiful and intuitive user interface.

## Features

- 📝 Create new bookmarks with custom names and URLs
- ✏️ Edit existing bookmarks
- 🗑️ Delete bookmarks with confirmation
- 🎨 Modern, responsive design
- 🔍 Easy bookmark management

## Technologies Used

- React.js
- Vite
- CSS Modules
- React Portal for modals
- Modern JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/BookMarks.git
```

2. Navigate to the project directory:
```bash
cd BookMarks
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:5173`.

## Usage

1. Click "Add Bookmark" to create a new bookmark
2. Enter the bookmark name and URL
3. Click "Create" to save the bookmark
4. Use the edit and delete buttons to manage your bookmarks
5. All changes are automatically saved to local storage

## Project Structure

```
BookMarks/
├── src/
│   ├── Components/
│   │   ├── BookMarkCard/
│   │   └── Modal/
│   ├── Pages/
│   │   └── HomePage/
│   ├── Data/
│   └── App.jsx
├── public/
└── package.json
```

## Vite + React

This project uses Vite for fast development and building. Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by macOS design principles
- Built with React and Vite best practices
- Uses modern web development techniques 