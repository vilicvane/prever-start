<%@ WebHandler Language="C#" Class="Upload" %>

using System;
using System.IO;
using System.Web;
using System.Configuration;

public class Upload : IHttpHandler 
{
    
    public void ProcessRequest (HttpContext context)
    {
        Prever.User.CheckRate(3);
        
        context.Response.ContentType = "text/plain";
        int amt = context.Request.Files.Count;
        string dir = Prever.Path.GetAbsolutePath(context.Request.Form["destDir"]);
        
        for (int i = 0; i < amt; i++ )
        {
            HttpPostedFile f = context.Request.Files[i];
            if (f.FileName.Length > 0)
                f.SaveAs(Prever.FileSystem.GetAvailableName(dir, Path.GetFileName(f.FileName)));
        }

        context.Response.Write("Done " + amt.ToString());
    }
 
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}