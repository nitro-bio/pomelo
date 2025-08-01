# 🧬 Pomelo - Open Source Bio ML Playground

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**An open-source platform for molecular visualization and protein structure prediction**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

## 🌟 Overview

Pomelo is a modern web-based platform for biological machine learning applications, focusing on protein structure prediction and molecular visualization. Built with cutting-edge web technologies and powered by state-of-the-art ML models, Pomelo provides researchers and developers with an intuitive interface for exploring protein structures.

## ✨ Features

- **🔬 Protein Structure Prediction**: Integrated ESMFold for predicting 3D protein structures from amino acid sequences
- **🎨 Interactive Molecular Visualization**: Powered by Molstar for high-quality 3D rendering
- **📊 Sequence Analysis**: Built-in sequence viewers for detailed protein analysis
- **🚀 Modern Tech Stack**: React + TypeScript frontend with FastAPI backend
- **🎯 User-Friendly Interface**: Clean, intuitive UI built with ShadCN components
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Rolldown
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN (Radix UI primitives)
- **State Management**: TanStack Query
- **Visualization**: 
  - Molstar & @nitro-bio/molstar-easy for 3D structures
  - @nitro-bio/sequence-viewers for sequence display
  - Recharts for data visualization

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: SQLite
- **Task Management**: Invoke
- **Deployment**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python 3.12
- pnpm (for JavaScript package management)
- uv (for Python package management)
- Docker & Docker Compose (for containerized deployment)

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/pomelo.git
cd pomelo
```

### Frontend Setup

```bash
cd frontend
pnpm install
```

### Backend Setup

```bash
cd backend
uv venv
uv pip install -r requirements.txt
```

### Environment Configuration

Create a `.env` file in the backend directory with necessary environment variables:

```bash
# Example environment variables
DATABASE_URL=sqlite:///database.db
```

## 💻 Development

### Running Development Servers

#### Frontend (runs on port 3000)
```bash
cd frontend
pnpm dev
```

#### Backend (runs on port 8000)
```bash
cd backend
uv run uvicorn main:app --reload
```

### Available Scripts

#### Frontend
```bash
# Run TypeScript check and ESLint
pnpm lint

# Watch mode for linting
pnpm lint:watch

# Build for production
pnpm build

# Format code
pnpm format:fix
```

#### Backend
```bash
# Run linting and type checking
uv run invoke lint

# Run the development server
uv run uvicorn main:app --reload
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Development environment
docker-compose up

# Production environment
docker-compose -f docker-compose.production.yml up
```

## 📖 Usage

### Using ESMFold for Protein Structure Prediction

1. Navigate to the homepage at `http://localhost:3000`
2. Click on "Use ESMFold" to access the protein folding interface
3. Enter or paste your amino acid sequence in the input field
4. Click "Fold Protein" to generate the 3D structure
5. Interact with the visualization:
   - Rotate: Click and drag
   - Zoom: Scroll or pinch
   - Pan: Right-click and drag

### API Endpoints

The backend provides RESTful API endpoints:

```bash
POST /api/v1/protein_fold/esmfold
Content-Type: application/json

{
  "sequence": "MAGEGDQQDAAAHNMGNHLPLLPAESEEDEMEVEDQDKEAKKPNIINFMTSLPTSHTYLGADMI"
}
```

## 📁 Project Structure

```
pomelo/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── api/            # API client and hooks
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── protein_folding/    # Protein folding module
│   │   └── esmfold/        # ESMFold implementation
│   ├── main.py             # FastAPI application
│   └── requirements.txt
├── dockerfiles/            # Docker configurations
├── docker-compose.yml      # Development compose
└── docker-compose.production.yml
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: Follow the existing TypeScript/React patterns
- **Backend**: Use type annotations and follow PEP 8
- Run linting before committing: `pnpm lint` (frontend) and `uv run invoke lint` (backend)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ESMFold](https://github.com/facebookresearch/esm) by Meta AI Research
- [Molstar](https://molstar.org/) for molecular visualization
- [Nitro Bio](https://github.com/nitro-bio) for sequence viewing components
- [ShadCN](https://ui.shadcn.com/) for beautiful UI components

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">
Made with ❤️ by the Pomelo Team
</div>