import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'API is running with TypeScript!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));