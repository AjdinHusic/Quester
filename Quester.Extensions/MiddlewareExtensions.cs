using Microsoft.AspNetCore.Builder;
namespace Quester.Extensions;

public static class QuesterUI
{
    public static IApplicationBuilder UseQuesterUI(this IApplicationBuilder app, QuesterUIOptions options)
    {
        return app.UseMiddleware<QuesterUIMiddleware>(options);
    }
}
