<%@ WebHandler Language="C#" Class="GetAvailableName" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class GetAvailableName : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Response rsp = new Response();

        try
        {
            Prever.User.CheckRate( 3 );
            rsp.Name = Path.GetFileName(Prever.FileSystem.GetAvailableName(Prever.Path.GetAbsolutePath(info.Directory), info.Name));
        }
        catch (Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }
    
    public class Info
    {
        public string Directory;
        public string Name;
    }

    public class Response : Prever.ForJSON.Response
    {
        public string Name;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}