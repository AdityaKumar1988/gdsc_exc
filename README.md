
# EcoTips

This is a NextJS starter in Firebase Studio.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    *   Create a `.env` file in the root directory.
    *   Add your Google Gemini API key:

        ```
        GOOGLE_GENAI_API_KEY=YOUR_API_KEY
        ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    This will start the application in development mode, usually at `http://localhost:9002`.

5.  **Run Genkit in development mode**

    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    # or
    pnpm genkit:dev
    ```

    Alternatively, watch the Genkit project for changes:

    ```bash
    npm run genkit:watch
    # or
    yarn genkit:watch
    # or
    pnpm genkit:watch
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

