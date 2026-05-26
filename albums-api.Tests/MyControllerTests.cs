using UnsecureApp.Controllers;
using Xunit;

namespace albums_api.Tests;

public class MyControllerTests
{
    [Fact]
    public void ReadFile_ReturnsFileContent_ForExistingFile()
    {
        var controller = new MyController();
        var tempFilePath = Path.GetTempFileName();
        const string content = "bonjour";

        try
        {
            File.WriteAllText(tempFilePath, content);

            var result = controller.ReadFile(tempFilePath);

            Assert.NotNull(result);
            Assert.Equal(content, result.TrimEnd('\0'));
        }
        finally
        {
            File.Delete(tempFilePath);
        }
    }

    [Fact]
    public void ReadFile_ThrowsFileNotFoundException_ForMissingFile()
    {
        var controller = new MyController();
        var missingPath = Path.Combine(Path.GetTempPath(), $"missing-{Guid.NewGuid():N}.txt");

        Assert.Throws<FileNotFoundException>(() => controller.ReadFile(missingPath));
    }

    [Fact]
    public void GetObject_DoesNotThrow()
    {
        var controller = new MyController();

        var exception = Record.Exception(() => controller.GetObject());

        Assert.Null(exception);
    }

    [Fact]
    public void GetProduct_ThrowsInvalidOperationException_WhenCommandHasNoConnection()
    {
        var controller = new MyController();

        Assert.Throws<InvalidOperationException>(() => controller.GetProduct("Widget"));
    }
}
