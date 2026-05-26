using albums_api.Controllers;
using albums_api.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace albums_api.Tests;

public class AlbumControllerTests
{
    [Fact]
    public void GetByYear_ReturnsOnlyAlbumsForRequestedYear()
    {
        var controller = new AlbumController();

        var result = controller.GetByYear(2020);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var albums = Assert.IsAssignableFrom<List<Album>>(okResult.Value);
        Assert.All(albums, a => Assert.Equal(2020, a.Year));
    }

    [Fact]
    public void Create_ReturnsCreatedAlbumWithId()
    {
        var controller = new AlbumController();
        var request = new AlbumUpsertRequest("New Album", "New Artist", 9.99, "https://example.test/new.png", 2026);

        var result = controller.Create(request);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var album = Assert.IsType<Album>(createdResult.Value);
        Assert.True(album.Id > 0);
        Assert.Equal(request.Title, album.Title);
        Assert.Equal(request.Year, album.Year);
    }

    [Fact]
    public void Update_ReturnsNotFound_WhenAlbumDoesNotExist()
    {
        var controller = new AlbumController();
        var request = new AlbumUpsertRequest("Missing", "Unknown", 1.00, "https://example.test/missing.png", 1999);

        var result = controller.Update(int.MaxValue, request);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Delete_ReturnsNoContent_WhenAlbumExists()
    {
        var controller = new AlbumController();
        var createResult = Assert.IsType<CreatedAtActionResult>(
            controller.Create(new AlbumUpsertRequest("Delete Me", "Artist", 8.25, "https://example.test/delete.png", 2025)));
        var album = Assert.IsType<Album>(createResult.Value);

        var deleteResult = controller.Delete(album.Id);

        Assert.IsType<NoContentResult>(deleteResult);
    }
}
