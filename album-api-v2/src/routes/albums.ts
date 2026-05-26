import { Router, Request, Response } from 'express';
import { AlbumStore, AlbumInput } from '../models/album';

const router = Router();

function parseInput(body: any): AlbumInput | null {
  if (!body || typeof body !== 'object') return null;
  const { title, artist, price, image_url, year } = body;
  if (
    typeof title !== 'string' ||
    typeof artist !== 'string' ||
    typeof price !== 'number' ||
    typeof image_url !== 'string' ||
    typeof year !== 'number'
  ) {
    return null;
  }
  return { title, artist, price, image_url, year };
}

// GET /albums
router.get('/', (_req: Request, res: Response) => {
  res.json(AlbumStore.getAll());
});

// GET /albums/sort?sortBy=title|artist|price
router.get('/sort', (req: Request, res: Response) => {
  const sortBy = String(req.query.sortBy ?? '').toLowerCase();
  const albums = AlbumStore.getAll();
  switch (sortBy) {
    case 'title':
      albums.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'artist':
      albums.sort((a, b) => a.artist.localeCompare(b.artist));
      break;
    case 'price':
      albums.sort((a, b) => a.price - b.price);
      break;
    default:
      return res.status(400).json({ error: "Invalid sort parameter. Use 'title', 'artist' or 'price'." });
  }
  return res.json(albums);
});

// GET /albums/year/:year
router.get('/year/:year', (req: Request, res: Response) => {
  const year = Number.parseInt(req.params.year, 10);
  if (Number.isNaN(year)) {
    return res.status(400).json({ error: 'Invalid year' });
  }
  return res.json(AlbumStore.getByYear(year));
});

// GET /albums/:id
router.get('/:id', (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const album = AlbumStore.getById(id);
  if (!album) {
    return res.status(404).json({ error: 'Album not found' });
  }
  return res.json(album);
});

// POST /albums
router.post('/', (req: Request, res: Response) => {
  const input = parseInput(req.body);
  if (!input) {
    return res.status(400).json({ error: 'Invalid album payload' });
  }
  const created = AlbumStore.create(input);
  return res.status(201).json(created);
});

// PUT /albums/:id
router.put('/:id', (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const input = parseInput(req.body);
  if (!input) {
    return res.status(400).json({ error: 'Invalid album payload' });
  }
  const updated = AlbumStore.update(id, input);
  if (!updated) {
    return res.status(404).json({ error: 'Album not found' });
  }
  return res.json(updated);
});

// DELETE /albums/:id
router.delete('/:id', (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const deleted = AlbumStore.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Album not found' });
  }
  return res.status(204).send();
});

export default router;
