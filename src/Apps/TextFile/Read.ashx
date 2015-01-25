<%@ WebHandler Language="C#" Class="Read" %>

using System;
using System.IO;
using System.Web;
using System.Text;
using Newtonsoft.Json;

public class Read : IHttpHandler
{
    
    public void ProcessRequest (HttpContext context)
    {
        string json = context.Request.Form["info"];

        Info info = JavaScriptConvert.DeserializeObject<Info>(json);
        Response rsp = new Response();
        
        try
        {
            Prever.User.CheckRate(2);
            context.Response.ContentType = "text/plain";
            
            string path = info.Path;

            path = Prever.Path.GetAbsolutePath(path);

            if (!File.Exists(path)) throw new FileNotFoundException();

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
                Prever.IdentifyEncoding myEncoding = new Prever.IdentifyEncoding();
                encoding = myEncoding.GetEncodingName(aimFile);
            }

            rsp.Encoding = encoding.WebName;
            rsp.Text = File.ReadAllText(path, encoding);
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
    
    public class Response : Prever.ForJSON.Response
    {
        public string Text;
        public string Encoding;
    }

    public class Info
    {
        public string Path;
        public string Encoding;
    }

}