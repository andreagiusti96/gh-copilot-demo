namespace albums_api.Models
{
    public record Album(int Id, string Title, string Artist, double Price, string Image_url, int Year)
    {
        private static readonly List<Album> Albums = new()
        {
            new Album(1, "You, Me and an App Id", "Daprize", 10.99, "https://aka.ms/albums-daprlogo", 2022),
            new Album(2, "Seven Revision Army", "The Blue-Green Stripes", 13.99, "https://aka.ms/albums-containerappslogo", 2020),
            new Album(3, "Scale It Up", "KEDA Club", 13.99, "https://aka.ms/albums-kedalogo", 2021),
            new Album(4, "Lost in Translation", "MegaDNS", 12.99, "https://aka.ms/albums-envoylogo", 2019),
            new Album(5, "Lock Down Your Love", "V is for VNET", 12.99, "https://aka.ms/albums-vnetlogo", 2023),
            new Album(6, "Sweet Container O' Mine", "Guns N Probeses", 14.99, "https://aka.ms/albums-containerappslogo", 2024)
        };

        public static List<Album> GetAll()
        {
            return Albums.ToList();
        }

        public static Album? GetById(int id)
        {
            return Albums.FirstOrDefault(a => a.Id == id);
        }

        public static List<Album> GetByYear(int year)
        {
            return Albums.Where(a => a.Year == year).ToList();
        }

        public static Album Create(string title, string artist, double price, string imageUrl, int year)
        {
            var nextId = Albums.Count == 0 ? 1 : Albums.Max(a => a.Id) + 1;
            var album = new Album(nextId, title, artist, price, imageUrl, year);
            Albums.Add(album);

            return album;
        }

        public static Album? Update(int id, string title, string artist, double price, string imageUrl, int year)
        {
            var index = Albums.FindIndex(a => a.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updatedAlbum = new Album(id, title, artist, price, imageUrl, year);
            Albums[index] = updatedAlbum;

            return updatedAlbum;
        }

        public static bool Delete(int id)
        {
            var album = Albums.FirstOrDefault(a => a.Id == id);
            if (album is null)
            {
                return false;
            }

            return Albums.Remove(album);
        }
    }
}
