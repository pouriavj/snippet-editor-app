# VS Code Replica with Live Database Integration

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![React Hook Form](https://img.shields.io/badge/ReactHookForm-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![CodeMirror](https://img.shields.io/badge/CodeMirror-000000?style=for-the-badge&logo=codemirror&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

This application(PWA) is a replica of the Visual Studio Code editor, featuring a nested folder structure, interactive create file/folder inputs, live database integration, and an intuitive vs-code style user interface. It utilizes Server Actions with useActionState hook, and React Hook Form (`rhf`) for efficient form handling and data management.

## ✨ Features

- **VS Code-like Interface:** A familiar and intuitive user experience.
- **Nested Folder Structure:** Easily navigate and manage files and folders.
- **Live Database Integration:** Real-time data persistence and synchronization.
- **Mock Input Handling:** Robust handling of user inputs using Server Actions and React Hook Form.
- **Responsive Design:** Adapts to various screen sizes.

## 🌐 Live Demo

Experience the Snippet Editor App live! You can access the deployed application here:

[Visit the Live Website](https://snippet-editor-lake.vercel.app)

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** CSS, MUI
- **Editor:** CodeMirror
- **Form Handling:** React Hook Form, useActionState
- **Database:** PostgreSQL
- **Deployment:** Vercel
- **Runtime:** React 19

## 🔰 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**

```bash
git clone <https://github.com/pouriavj/snippet-editor-app.git>
cd <snippet-editor-app>

```

2.  **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install

```

### Running the Development Server

1.  **Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


```

2.  **Open the application:**

Your application will be available at `http://localhost:3000` after the development server has started.

## Deployment

This project is ready to be deployed on any platform that supports Next.js applications.

### Vercel

The easiest way to deploy this project is to use Vercel.

1.  **Create a new repository** on GitHub and push your project to it.
2.  **Deploy on Vercel:** Import your GitHub repository into Vercel and your project will be deployed automatically.

### Other Platforms

You can also deploy this project on other platforms like Netlify, AWS Amplify, or any other Node.js-compatible hosting service. Follow the documentation of your chosen platform for specific deployment instructions.

**Environment Variables:**

Make sure to set the following environment variables in your deployment environment:

- `DATABASE_URL`: Your PostgreSQL database connection URL.
- `NEXTAUTH_URL`: The URL of your deployed application.
- `NEXTAUTH_SECRET`: A secret for NextAuth.js.

## Key Implementation Details

- **Server Actions + `useActionState`:** Used for handling form submissions and server-side mutations with a clean React 19 workflow.
- **React Hook Form (`rhf`):** Manages form state, validation, and input handling efficiently.
- **Nested Folder Tree:** Implements a VS Code-like file explorer with hierarchical folder/file navigation.
- **Live Database Integration:** Persists snippets and updates in PostgreSQL for real-time data consistency.
- **CodeMirror Editor:** Provides an embedded code editor experience with syntax highlighting and a familiar developer workflow.
- **Responsive UI:** Keeps the interface clean and adaptable across screen sizes and mobile app.
- **Component-based Architecture:** Organized into reusable components for maintainability and scalability.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  **Fork the repository** and create your branch: `git checkout -b feature/your-feature-name`
2.  **Commit your changes:** `git commit -m 'Add some feature'`
3.  **Push to the branch:** `git push origin feature/your-feature-name`
4.  **Open a Pull Request.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
