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

            DirectoryInfo dir = new DirectoryInfo(path);

            rsp.InnerFilesAmount = dir.GetFiles().Length;
            rsp.InnerDirsAmount = dir.GetDirectories().Length;
            rsp.FactualPath = path;
            rsp.CreationTime = dir.CreationTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.LastWriteTime = dir.LastWriteTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.LastAccessTime = dir.LastAccessTime.ToString("yyyy年MM月dd日, HH:mm:ss");
            rsp.Attributes = dir.Attributes.ToString();
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
        public int InnerFilesAmount;
        public int InnerDirsAmount;
        public string FactualPath;
        public string CreationTime;
        public string LastWriteTime;
        public string LastAccessTime;
        public string Attributes;
    }
}