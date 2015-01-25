<%@ WebHandler Language="C#" Class="GetDetails" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class GetDetails : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        Response rsp = new Response();

        try
        {
            Prever.User.CheckRate(2);
            context.Response.ContentType = "text/plain";

            string path = Prever.Path.GetAbsolutePath(context.Request.Form["path"]);

            FileInfo file = new FileInfo(path);

            rsp.Length = file.Length;
            rsp.FactualPath = path;
            rsp.CreationTime = file.CreationTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.LastWriteTime = file.LastWriteTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.LastAccessTime = file.LastAccessTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.Attributes = file.Attributes.ToString();
        }
        catch(Exception e)
        {
            rsp.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(rsp));
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public class Response : Prever.ForJSON.Response
    {
        public long Length;
        public string FactualPath;
        public string CreationTime;
        public string LastWriteTime;
        public string LastAccessTime;
        public string Attributes;
    }
}