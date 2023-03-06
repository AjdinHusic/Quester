using Microsoft.AspNetCore.Builder;

namespace QuesterUI;

public static class QuesterUI
{
    public static IApplicationBuilder UseQuesterUI(this IApplicationBuilder app, QuesterUIOptions options)
    {
        return app.UseMiddleware<QuesterUIMiddleware>(options);
    }
}
