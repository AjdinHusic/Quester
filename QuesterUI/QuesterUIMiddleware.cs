using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace QuesterUI;

public class QuesterUIMiddleware
{
    private const string EmbeddedFileNamespace = "QuesterUI.node_modules.quester_ui";

    private readonly QuesterUIOptions _options;
    private readonly StaticFileMiddleware _staticFileMiddleware;

    public QuesterUIMiddleware(RequestDelegate next, IWebHostEnvironment hostingEnv, ILoggerFactory loggerFactory, QuesterUIOptions? options)
    {
        _options = options ?? new QuesterUIOptions();
        _staticFileMiddleware = createStaticFileMiddleware(next, hostingEnv, loggerFactory, options);
    }

    public async Task Invoke(HttpContext httpContext)
    {
        var httpMethod = httpContext.Request.Method;
        var path = httpContext.Request.Path.Value;

        if (httpMethod == "GET" &&
            Regex.IsMatch(path, $"^/?{Regex.Escape(_options.RoutePrefix)}/?$", RegexOptions.IgnoreCase))
        {
            var relativeIndexUrl = string.IsNullOrEmpty(path) || path.EndsWith("/")
                ? "index.html"
                : $"{path.Split('/').Last()}/index.html";
            RespondWithRedirect(httpContext.Response, relativeIndexUrl);
            return;
        }

        if (httpMethod == "GET" && Regex.IsMatch(path, $"^/{Regex.Escape(_options.RoutePrefix)}/?index.html$",
                RegexOptions.IgnoreCase))
        {
            await RespondWithIndexHtml(httpContext.Response);
            return;
        }

        await _staticFileMiddleware.Invoke(httpContext);
    }

    private StaticFileMiddleware createStaticFileMiddleware(
        RequestDelegate next, 
        IWebHostEnvironment hostingEnv,
        ILoggerFactory loggerFactory,
        QuesterUIOptions options)
    {
        var staticFileOptions = new StaticFileOptions
        {
            RequestPath = string.IsNullOrEmpty(options.RoutePrefix) ? string.Empty : $"/{options.RoutePrefix}",
            FileProvider = new EmbeddedFileProvider(typeof(QuesterUIMiddleware).GetTypeInfo().Assembly, EmbeddedFileNamespace),
        };
        return new StaticFileMiddleware(next, hostingEnv, Options.Create(staticFileOptions), loggerFactory);
    }

    private void RespondWithRedirect(HttpResponse response, string location)
    {
        response.StatusCode = 301;
        response.Headers["Location"] = location;
    }

    private async Task RespondWithIndexHtml(HttpResponse response)
    {
        response.StatusCode = 200;
        response.ContentType = "text/html;charset=utf-8";

        await using var stream = _options.IndexStream();
        using var reader = new StreamReader(stream);
        var htmlBuilder = new StringBuilder(await reader.ReadToEndAsync());
        foreach (var entry in GetIndexArguments())
        {
            htmlBuilder.Replace(entry.Key, entry.Value);
        }
        await response.WriteAsync(htmlBuilder.ToString(), Encoding.UTF8);
    }

    private IDictionary<string, string> GetIndexArguments()
    {
        var indexArguments = new Dictionary<string, string>()
        {
            { "%(SWAGGER_URL)", _options.SwaggerUrl },
        };
        if (!string.IsNullOrWhiteSpace(_options.LoginPath))
        {
            indexArguments.Add("%(LOGIN_PATH)", _options.LoginPath);
        }
        if (!string.IsNullOrWhiteSpace(_options.LoginUsernameProperty))
        {
            indexArguments.Add("%(LOGIN_USERNAME_PROPERTY)", _options.LoginUsernameProperty);
        }
        if (!string.IsNullOrWhiteSpace(_options.LoginUsernameProperty))
        {
            indexArguments.Add("%(LOGIN_PASSWORD_PROPERTY)", _options.LoginPasswordProperty);
        }

        return indexArguments;
    }
}