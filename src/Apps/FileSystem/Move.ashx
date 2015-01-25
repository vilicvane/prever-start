<%@ WebHandler Language="C#" Class="Move" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class Move : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];
        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Prever.ForJSON.Response rsp = new Prever.ForJSON.Response();

        try
        {
            Prever.User.CheckRate(3);

            string srcPath = Prever.Path.GetAbsolutePath(info.SrcPath);
            string destPath = Prever.Path.GetAbsolutePath(info.DestPath);

            if (File.Exists(destPath)) throw new Prever.Exception.FileAlreadyExistsException();
            if (Directory.Exists(destPath)) throw new Prever.Exception.DirectoryAlreadyExistsException();
            
            if (info.IsFolder) Directory.Move(srcPath, destPath);
            else File.Move(srcPath, destPath);
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
        public bool IsFolder;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}