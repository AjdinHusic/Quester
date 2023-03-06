using System.Reflection;

namespace QuesterUI;

public class QuesterUIOptions
{
    public string RoutePrefix { get; set; } = "quester";

    public string SwaggerUrl { get; set; } = "swagger/v1/swagger.json";
    
    public string? LoginPath { get; set; }
    public string? LoginUsernameProperty { get; set; }
    public string? LoginPasswordProperty { get; set; }
    
    public Func<Stream> IndexStream { get; set; } =
        () => typeof(QuesterUIOptions)
            .GetTypeInfo()
            .Assembly
            .GetManifestResourceStream("QuesterUI.node_modules.quester_ui.index.html");
}