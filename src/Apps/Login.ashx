<%@ WebHandler Language="C#" Class="Login" %>

using System;
using System.IO;
using System.Web;

public class Login : IHttpHandler
{
    
    public void ProcessRequest (HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string userName = context.Request.Form["username"];
        string passCode = context.Request.Form["passcode"];
        string dna = context.Request.Form["dna"];
        string userPath = Prever.Settings.Path.DiskPath + userName + "\\";
        //Directory.GetDirectories();
        if (!Directory.Exists(userPath))
        {
            Prever.Response.Error.Login.WrongUserName();
            return;
        }
        
        string cFile = userPath + "Prever\\User.pcd";
        if (!File.Exists(cFile))
        {
            Prever.Response.Error.Login.WrongUserName();
            return;
        }
        
        StreamReader config = File.OpenText(cFile);
        string userID = config.ReadLine().Trim();
        if (userID.ToLower() != userName.ToLower())
        {
            Prever.Response.Error.Login.WrongUserName();
            return;
        }

        string pPasscode = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(config.ReadLine().Trim() + dna, "md5").ToLower();
        if (passCode != pPasscode)
        {
            Prever.Response.Error.Login.WrongPassword();
            return;
        }

        int rate = int.Parse(config.ReadLine().Trim());
        string skinPath = config.ReadLine().Trim();
        
        string settings =
            "User.ID = 'Vilic';" +
            "User.Rate = " + rate.ToString() + ";" +
            "System.Drive = {};" +
            "System.Drive.System = '" + Prever.Settings.Path.SystemDrive + "';" +
            "System.Drive.Disk = '" + Prever.Settings.Path.DiskDrive + "';" +
            "User.SkinPath = '" + skinPath + "';";

        context.Response.Write(settings);
    }
 
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}