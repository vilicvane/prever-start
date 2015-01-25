<%@ WebHandler Language="C#" Class="GetInfo" %>

using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

public class GetInfo : IHttpHandler
{
    DirectoryInfo dirInfo;
    bool showHidden = false;
    
    public void ProcessRequest (HttpContext context)
    {
        Info info = new Info();

        try
        {
            Prever.User.CheckRate(1);

            context.Response.ContentType = "text/plain";
            string dir = context.Request.Form["dir"];
            dir = Prever.Path.GetAbsolutePath(dir);
            int type = int.Parse(context.Request.Form["type"]);

            if (context.Request.Form["showhidden"] != null)
                showHidden = bool.Parse(context.Request.Form["showhidden"]);
            
            dirInfo = new DirectoryInfo(dir);
            
            if (type == 0 || type == 2)
                info.Directories = getDirectories();
            if (type == 1 || type == 2)
                info.Files = getFiles();
            
        }
        catch(Exception e)
        {
            info.Error = Prever.Exception.GetString(e);
        }

        context.Response.Write(JavaScriptConvert.SerializeObject(info));
    }

    public DirItems getDirectories()
    {
        DirectoryInfo[] dirs = dirInfo.GetDirectories();
        DirItems dItems = new DirItems();
        foreach (DirectoryInfo d in dirs)
        {
            bool hidden = d.Attributes.ToString().Contains("Hidden");

            if (!showHidden && hidden) continue;
            
            dItems.Names.Add(d.Name);
            dItems.Hiddens.Add(hidden);
            dItems.LastWriteTimes.Add(d.LastWriteTime.ToLongDateString());
        }
        return dItems;
    }

    public FileItems getFiles()
    {
        HttpContext context = HttpContext.Current;
        
        FileInfo[] files = dirInfo.GetFiles();

        FileItems fItems = new FileItems();
        
        if (context.Request.Form["re"] != null)
        {
            Regex re = new Regex(context.Request.Form["re"]);

            foreach (FileInfo f in files)
            {
                string name = f.Name;
                bool hidden = f.Attributes.ToString().Contains("Hidden");

                if ((!showHidden && hidden) || !re.IsMatch(name)) continue;
                
                fItems.Names.Add(name);
                fItems.Sizes.Add(f.Length);
                fItems.Hiddens.Add(hidden);
                fItems.LastWriteTimes.Add(f.LastWriteTime.ToLongDateString());
            }
        }
        else
            foreach (FileInfo f in files)
            {
                bool hidden = f.Attributes.ToString().Contains("Hidden");

                if (!showHidden && hidden) continue;

                fItems.Names.Add(f.Name);
                fItems.Sizes.Add(f.Length);
                fItems.Hiddens.Add(hidden);
                fItems.LastWriteTimes.Add(f.LastWriteTime.ToLongDateString());
            }
        
        return fItems;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public class FileItems
    {
        public ArrayList Names = new ArrayList();
        public ArrayList Hiddens = new ArrayList();
        public ArrayList LastWriteTimes = new ArrayList();
        public ArrayList Sizes = new ArrayList();
    }

    public class DirItems
    {
        public ArrayList Names = new ArrayList();
        public ArrayList Hiddens = new ArrayList();
        public ArrayList LastWriteTimes = new ArrayList();
    }
    
    public class Info
    {
        public string Error;
        public FileItems Files;
        public DirItems Directories;
    }
}