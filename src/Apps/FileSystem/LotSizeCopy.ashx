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
            ArrayList files = new ArrayList();
            ArrayList dirs = new ArrayList();
        
            foreach (string f in info.Files)
                files.Add(Prever.Path.GetAbsolutePath(f));
            foreach (string d in info.Directories)
                dirs.Add(Prever.Path.GetAbsolutePath(d));

            string to = Prever.Path.GetAbsolutePath(info.To, true);
            
            if (cover > 0) Prever.FileSystem.LotSizeCopy(files, dirs, to, true);
            else if (cover == 0)
            {
                foreach (string f in files)
                {
                    string aim = to + Path.GetFileName(f);
                    if (aim == f) continue;
                    if (File.Exists(aim))
                        throw new Prever.Exception.FileAlreadyExistsException();
                    else if (Directory.Exists(aim))
                        throw new Prever.Exception.DirectoryAlreadyExistsException();
                }
                
                foreach (string d in dirs)
                {
                    string aim = to + Path.GetFileName(d);
                    if (aim == d) continue;
                    if (aim.IndexOf(d) == 0) throw new Prever.Exception.SourceDirectoryContainsAimDirectoryException();
                    if (File.Exists(aim))
                        throw new Prever.Exception.FileAlreadyExistsException();
                    else if (Directory.Exists(aim))
                        throw new Prever.Exception.DirectoryAlreadyExistsException();
                }

                Prever.FileSystem.LotSizeCopy(files, dirs, to, true);
            }
            else Prever.FileSystem.LotSizeCopy(files, dirs, to, false);
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
        public ArrayList Files;
        public ArrayList Directories;
        public string To;
    }

    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}