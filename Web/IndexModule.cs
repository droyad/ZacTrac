using Nancy;

namespace Web
{
    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get["/"] = p => Response.AsFile("ui/index.html");
        } 
    }
}