import { createApp } from './app';

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

const app = createApp();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`album-api-v2 listening on http://localhost:${PORT}`);
});
