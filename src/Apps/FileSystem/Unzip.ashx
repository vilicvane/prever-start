<%@ WebHandler Language="C#" Class="Unzip" %>

using System;
using System.Web;
using Newtonsoft.Json;

public class Unzip : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Response rsp = new Response();

        try
        {
            Prever.User.CheckRate(3);

            string src = Prever.Path.GetAbsolutePath(info.SrcPath);
            string dest = Prever.Path.GetAbsolutePath(info.DestPath);

            dest = Prever.FileSystem.GetAvailableName(dest);

            Prever.Zip.Unzip(src, dest);
            rsp.DestPath = dest;
        }
        catch (Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }

    public class Info
    {
        public string SrcPath;
        public string DestPath;
    }

    public class Response : Prever.ForJSON.Response
    {
        public string DestPath;
    }
 
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}