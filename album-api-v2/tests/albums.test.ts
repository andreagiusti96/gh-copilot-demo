import request from 'supertest';
import { createApp } from '../src/app';
import { AlbumStore } from '../src/models/album';

const app = createApp();

beforeEach(() => {
  AlbumStore.reset();
});

describe('GET /', () => {
  it('returns the hint message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('/albums');
  });
});

describe('GET /albums', () => {
  it('returns all 6 seed albums', async () => {
    const res = await request(app).get('/albums');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(6);
    expect(res.body[0]).toMatchObject({ id: 1, artist: 'Daprize' });
  });
});

describe('GET /albums/sort', () => {
  it('sorts by title', async () => {
    const res = await request(app).get('/albums/sort').query({ sortBy: 'title' });
    expect(res.status).toBe(200);
    const titles = res.body.map((a: any) => a.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/albums/sort').query({ sortBy: 'price' });
    expect(res.status).toBe(200);
    const prices = res.body.map((a: any) => a.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('returns 400 for invalid sortBy', async () => {
    const res = await request(app).get('/albums/sort').query({ sortBy: 'bogus' });
    expect(res.status).toBe(400);
  });
});

describe('GET /albums/year/:year', () => {
  it('filters by year', async () => {
    const res = await request(app).get('/albums/year/2022');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(1);
  });

  it('returns empty array when no match', async () => {
    const res = await request(app).get('/albums/year/1900');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /albums/:id', () => {
  it('returns the album when found', async () => {
    const res = await request(app).get('/albums/2');
    expect(res.status).toBe(200);
    expect(res.body.artist).toBe('The Blue-Green Stripes');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/albums/9999');
    expect(res.status).toBe(404);
  });
});

describe('POST /albums', () => {
  it('creates a new album and returns 201', async () => {
    const payload = {
      title: 'Brand New',
      artist: 'Newcomer',
      price: 9.5,
      image_url: 'https://example.com/img.png',
      year: 2026
    };
    const res = await request(app).post('/albums').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 7, ...payload });

    const list = await request(app).get('/albums');
    expect(list.body).toHaveLength(7);
  });

  it('returns 400 for an invalid payload', async () => {
    const res = await request(app).post('/albums').send({ title: 'no-other-fields' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /albums/:id', () => {
  it('updates an existing album', async () => {
    const payload = {
      title: 'Renamed',
      artist: 'Daprize',
      price: 1.0,
      image_url: 'x',
      year: 2022
    };
    const res = await request(app).put('/albums/1').send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: 'Renamed' });
  });

  it('returns 404 when album is missing', async () => {
    const res = await request(app).put('/albums/999').send({
      title: 't', artist: 'a', price: 1, image_url: 'x', year: 2000
    });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /albums/:id', () => {
  it('removes the album and returns 204', async () => {
    const res = await request(app).delete('/albums/1');
    expect(res.status).toBe(204);

    const after = await request(app).get('/albums/1');
    expect(after.status).toBe(404);
  });

  it('returns 404 when album is missing', async () => {
    const res = await request(app).delete('/albums/999');
    expect(res.status).toBe(404);
  });
});
