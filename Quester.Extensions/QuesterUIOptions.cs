using System.Reflection;

namespace Quester.Extensions;

public class QuesterUIOptions
{
    public string RoutePrefix { get; set; } = "quester";

    public Func<Stream> IndexStream { get; set; } =
        () => typeof(QuesterUIOptions).GetTypeInfo().Assembly.GetManifestResourceStream("Quester.Extensions.node_modules.quester_ui.index.html");
}