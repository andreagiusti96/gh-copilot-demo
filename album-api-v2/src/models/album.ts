export interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
  year: number;
}

const seed: Album[] = [
  { id: 1, title: 'You, Me and an App Id', artist: 'Daprize', price: 10.99, image_url: 'https://aka.ms/albums-daprlogo', year: 2022 },
  { id: 2, title: 'Seven Revision Army', artist: 'The Blue-Green Stripes', price: 13.99, image_url: 'https://aka.ms/albums-containerappslogo', year: 2020 },
  { id: 3, title: 'Scale It Up', artist: 'KEDA Club', price: 13.99, image_url: 'https://aka.ms/albums-kedalogo', year: 2021 },
  { id: 4, title: 'Lost in Translation', artist: 'MegaDNS', price: 12.99, image_url: 'https://aka.ms/albums-envoylogo', year: 2019 },
  { id: 5, title: 'Lock Down Your Love', artist: 'V is for VNET', price: 12.99, image_url: 'https://aka.ms/albums-vnetlogo', year: 2023 },
  { id: 6, title: 'Sweet Container O\' Mine', artist: 'Guns N Probeses', price: 14.99, image_url: 'https://aka.ms/albums-containerappslogo', year: 2024 }
];

let albums: Album[] = seed.map(a => ({ ...a }));

export type AlbumInput = Omit<Album, 'id'>;

export const AlbumStore = {
  reset(): void {
    albums = seed.map(a => ({ ...a }));
  },

  getAll(): Album[] {
    return albums.slice();
  },

  getById(id: number): Album | undefined {
    return albums.find(a => a.id === id);
  },

  getByYear(year: number): Album[] {
    return albums.filter(a => a.year === year);
  },

  create(input: AlbumInput): Album {
    const nextId = albums.length === 0 ? 1 : Math.max(...albums.map(a => a.id)) + 1;
    const album: Album = { id: nextId, ...input };
    albums.push(album);
    return album;
  },

  update(id: number, input: AlbumInput): Album | null {
    const index = albums.findIndex(a => a.id === id);
    if (index < 0) return null;
    const updated: Album = { id, ...input };
    albums[index] = updated;
    return updated;
  },

  delete(id: number): boolean {
    const index = albums.findIndex(a => a.id === id);
    if (index < 0) return false;
    albums.splice(index, 1);
    return true;
  }
};
