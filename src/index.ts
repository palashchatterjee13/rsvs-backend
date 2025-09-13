import { DEFAULT_PORT } from './resources/values';
import app from './app';

const port = process.env.PORT || (DEFAULT_PORT + 1);

app.listen(port, () => {
    console.log(`ℹ️  [server]: Server is also running at http://localhost:${port}`);
});