using albums_api.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace albums_api.Controllers
{
    public record AlbumUpsertRequest(string Title, string Artist, double Price, string Image_url, int Year);

    [Route("albums")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        // GET: api/album
        [HttpGet]
        public IActionResult Get()
        {
            var albums = Album.GetAll();

            return Ok(albums);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var album = Album.GetById(id);
            if (album == null)
            {
                return NotFound();
            }
            return Ok(album);   
        }

        // function that retrieves albums and sorts them by title, artist or price
        [HttpGet("sort")]
        public IActionResult GetSorted(string sortBy)
        {
            var albums = Album.GetAll();            
            switch (sortBy.ToLower())
            {
                case "title":
                    albums = albums.OrderBy(a => a.Title).ToList();
                    break;
                case "artist":
                    albums = albums.OrderBy(a => a.Artist).ToList();
                    break;
                case "price":
                    albums = albums.OrderBy(a => a.Price).ToList();
                    break;
                default:
                    return BadRequest("Invalid sort parameter. Use 'title', 'artist' or 'price'.");
            }
            return Ok(albums);  
        }

        [HttpGet("year/{year:int}")]
        public IActionResult GetByYear(int year)
        {
            var albums = Album.GetByYear(year);
            return Ok(albums);
        }

        [HttpPost]
        public IActionResult Create([FromBody] AlbumUpsertRequest request)
        {
            var createdAlbum = Album.Create(request.Title, request.Artist, request.Price, request.Image_url, request.Year);
            return CreatedAtAction(nameof(Get), new { id = createdAlbum.Id }, createdAlbum);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] AlbumUpsertRequest request)
        {
            var updatedAlbum = Album.Update(id, request.Title, request.Artist, request.Price, request.Image_url, request.Year);
            if (updatedAlbum is null)
            {
                return NotFound();
            }

            return Ok(updatedAlbum);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var deleted = Album.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
