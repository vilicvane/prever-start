<%@ WebHandler Language="C#" Class="FileTrasmit" %>

using System;
using System.IO;
using System.Web;

public class FileTrasmit : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            Prever.User.CheckRate(2);

            string path = Prever.Path.GetAbsolutePath(context.Request.QueryString["path"]);
            if (context.Request.QueryString["contenttype"] != null)
                context.Response.ContentType = context.Request.QueryString["contenttype"];
            else if (context.Request.QueryString["download"] != null)
            {
                FileInfo file = new FileInfo(path);
                context.Response.ContentType = "application/octet-stream";
                context.Response.AddHeader("content-length", file.Length.ToString());
                string name = context.Server.UrlPathEncode(System.IO.Path.GetFileName(path));
                context.Response.AddHeader("content-disposition", "attachment; filename=" + name);
            }
            context.Response.TransmitFile(path);
        }
        catch { context.Response.StatusCode = 400; }
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}