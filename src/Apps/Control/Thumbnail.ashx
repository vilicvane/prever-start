<%@ WebHandler Language="C#" Class="Thumbnail" %>

using System;
using System.IO;
using System.Web;
using System.Drawing;

public class Thumbnail : IHttpHandler
{
    string thFolder = "Thumbnail.sys";
    string ext = ".thumbnail";
    public void ProcessRequest (HttpContext context)
    {
        Prever.User.CheckRate(2);
        context.Response.ContentType = "image";

        string path = Prever.Path.GetAbsolutePath(context.Request.QueryString["path"]);
        int width = int.Parse(context.Request.QueryString["width"]);
        int height = int.Parse(context.Request.QueryString["height"]);
        bool remake = (context.Request.QueryString["remake"] != null) ? bool.Parse(context.Request.QueryString["remake"]) : false;

        string thPath = GetThumbnail(path, width, height, remake);
        
        context.Response.TransmitFile(thPath);
    }

    public string GetThumbnail(string path, int width, int height, bool remake)
    {
        string thDir = Path.GetDirectoryName(path) + "\\" + thFolder;

        if (!Directory.Exists(thDir))
        {
            Directory.CreateDirectory(thDir);
            File.SetAttributes(thDir, FileAttributes.Hidden);
        }
        string aimPath = thDir + "\\" + Path.GetFileName(path) + ext;

        if (Directory.Exists(aimPath)) Directory.Delete(aimPath);
        else if (File.Exists(aimPath) && !remake) return aimPath; 
        
        try
        {
            Image sImg = Image.FromFile(path); //获得图片
            int w = sImg.Width;
            int h = sImg.Height;

            if (w > width || h > height)
            {
                double cTime = width * 1.0 / height;
                double sTime = w * 1.0 / h;
                if (sTime > cTime)
                {
                    w = width;
                    h = (int)(width / sTime);
                }
                else
                {
                    w = (int)(height * sTime);
                    h = height;
                }
            }

            Bitmap aImg = new Bitmap(w, h);
            Graphics g = Graphics.FromImage(aImg);

            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            g.Clear(Color.White);
            g.DrawImage(sImg, 0, 0, w, h);

            aImg.Save(aimPath, System.Drawing.Imaging.ImageFormat.Jpeg); //保存图片

            sImg.Dispose();
            aImg.Dispose();
            g.Dispose();
        }
        catch
        {
            Bitmap aImg = new Bitmap(width, height);
            Graphics g = Graphics.FromImage(aImg);
            g.Clear(Color.White);

            g.DrawString("绘图\n失败", new Font("Arial", 6), new SolidBrush(Color.Gray), 5, 5);

            aImg.Save(aimPath, System.Drawing.Imaging.ImageFormat.Jpeg); //保存图片

            aImg.Dispose();
            g.Dispose();
        }
        
        return aimPath;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}