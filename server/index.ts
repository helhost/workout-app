import * as dotenv from 'dotenv';
// Load environment variables first - before importing app
dotenv.config();

import app from "./src/app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Allowed origins: ${process.env.ALLOWED_ORIGINS || 'Default origins'}`);
});