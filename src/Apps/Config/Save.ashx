<%@ WebHandler Language="C#" Class="Save" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class Save : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Prever.ForJSON.Response rsp = new Prever.ForJSON.Response();

        try
        {
            Prever.User.CheckRate(3);
            
            string path = Prever.Path.GetAbsolutePath(info.Path);

            FileInfo file = new FileInfo(path);
            StreamWriter writer = file.CreateText();
            
            writer.Write(info.JSON);
            writer.Dispose();
        }
        catch (Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }
    
    public class Info
    {
        public string Path;
        public string JSON;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}