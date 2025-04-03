import app from "./src/app";
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});