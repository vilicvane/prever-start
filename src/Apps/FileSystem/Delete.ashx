<%@ WebHandler Language="C#" Class="Delete" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class Delete : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Prever.ForJSON.Response rsp = new Prever.ForJSON.Response();

        try
        {
            Prever.User.CheckRate(3);
            
            foreach (string f in info.Files)
                File.Delete(Prever.Path.GetAbsolutePath(f));
            
            foreach (string d in info.Directories)
                Directory.Delete(Prever.Path.GetAbsolutePath(d), true);
        }
        catch (Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }

    public class Info
    {
        public ArrayList Files;
        public ArrayList Directories;
    }

    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}