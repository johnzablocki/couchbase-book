using Nancy;
using Nancy.Bootstrapper;
using Nancy.Configuration;

namespace Dotnet
{
    public class Bootstrapper :DefaultNancyBootstrapper
    {
        public override void Configure(INancyEnvironment env)
        {
            env.Tracing(enabled: true, displayErrorTraces: true);
        }
    }
}