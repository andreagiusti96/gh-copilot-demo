import { AlbumStore } from '../src/models/album';

beforeEach(() => {
  AlbumStore.reset();
});

describe('AlbumStore', () => {
  it('seeds 6 albums', () => {
    expect(AlbumStore.getAll()).toHaveLength(6);
  });

  it('getById returns the album when found', () => {
    const album = AlbumStore.getById(1);
    expect(album).toBeDefined();
    expect(album?.artist).toBe('Daprize');
  });

  it('getById returns undefined when missing', () => {
    expect(AlbumStore.getById(999)).toBeUndefined();
  });

  it('getByYear filters correctly', () => {
    const albums = AlbumStore.getByYear(2022);
    expect(albums).toHaveLength(1);
    expect(albums[0].id).toBe(1);
  });

  it('create assigns the next id', () => {
    const created = AlbumStore.create({
      title: 'New One',
      artist: 'Tester',
      price: 9.99,
      image_url: 'https://example.com/a.png',
      year: 2025
    });
    expect(created.id).toBe(7);
    expect(AlbumStore.getAll()).toHaveLength(7);
  });

  it('update mutates an existing album', () => {
    const updated = AlbumStore.update(1, {
      title: 'Renamed',
      artist: 'Daprize',
      price: 1.0,
      image_url: 'x',
      year: 2022
    });
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe('Renamed');
    expect(AlbumStore.getById(1)?.title).toBe('Renamed');
  });

  it('update returns null when album is missing', () => {
    const updated = AlbumStore.update(999, {
      title: 't', artist: 'a', price: 1, image_url: 'x', year: 2000
    });
    expect(updated).toBeNull();
  });

  it('delete removes an album and returns true', () => {
    expect(AlbumStore.delete(1)).toBe(true);
    expect(AlbumStore.getById(1)).toBeUndefined();
  });

  it('delete returns false when missing', () => {
    expect(AlbumStore.delete(999)).toBe(false);
  });

  it('reset restores the seed data', () => {
    AlbumStore.delete(1);
    AlbumStore.reset();
    expect(AlbumStore.getAll()).toHaveLength(6);
  });
});
