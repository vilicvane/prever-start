<%@ WebHandler Language="C#" Class="CreateDirectory" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class CreateDirectory : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Prever.ForJSON.Response rsp = new Prever.ForJSON.Response();

        try
        {
            Prever.User.CheckRate( 3 );
            string path = Prever.Path.GetAbsolutePath(info.Directory);
            if (File.Exists(path)) throw new Prever.Exception.FileAlreadyExistsException();
            if (Directory.Exists(path)) throw new Prever.Exception.DirectoryAlreadyExistsException();
            Directory.CreateDirectory(path);
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
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}