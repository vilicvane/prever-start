<%@ WebHandler Language="C#" Class="Save" %>

using System;
using System.IO;
using System.Web;
using System.Text;
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
            context.Response.ContentType = "text/plain";
            
            string path = info.Path;

            path = Prever.Path.GetAbsolutePath(path);

            Encoding encoding = null;
            if (info.Encoding != null)
            {
                try
                {
                    encoding = Encoding.GetEncoding(info.Encoding);
                }
                catch { }
            }
            if (encoding == null)
            {
                FileInfo aimFile = new FileInfo(path);
                if (aimFile.Exists)
                {
                    Prever.IdentifyEncoding myEncoding = new Prever.IdentifyEncoding();
                    encoding = myEncoding.GetEncodingName(aimFile);
                }
                else encoding = Encoding.UTF8;
            }

            File.WriteAllText(path, info.Text, encoding);
        }
        catch (Exception e)
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

    public class Info
    {
        public string Path;
        public string Encoding;
        public string Text;
    }

}