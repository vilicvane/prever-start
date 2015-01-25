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

            int cover = info.Cover;

            string src = Prever.Path.GetAbsolutePath(info.SrcPath);
            string dest = Prever.Path.GetAbsolutePath(info.DestPath);

            if (cover > 0) File.Copy(src, dest, true);
            else if (cover == 0)
            {
                if (File.Exists(dest))
                    throw new Prever.Exception.FileAlreadyExistsException();
                else if (Directory.Exists(dest))
                    throw new Prever.Exception.DirectoryAlreadyExistsException();

                File.Copy(src, dest);
            }
            else File.Copy(src, dest);
        }
        catch (Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }

    
    public class Info
    {
        public int Cover;
        public string SrcPath;
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