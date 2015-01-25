<%@ WebHandler Language="C#" Class="Thumbnail" %>

using System;
using System.IO;
using System.Web;
using System.Drawing;

public class Thumbnail : IHttpHandler
{
    public void ProcessRequest (HttpContext context)
    {
        Prever.User.CheckRate(2);
        context.Response.ContentType = "image";
        
        string path = Prever.Path.GetAbsolutePath(context.Request.QueryString["path"]);
        int width = int.Parse(context.Request.QueryString["width"]);
        int height = int.Parse(context.Request.QueryString["height"]);
        
        context.Response.BinaryWrite(GetThumbnail(path, width, height).ToArray());
        
    }

    public MemoryStream GetThumbnail(string path, int width, int height)
    {
        MemoryStream mS = new MemoryStream();
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

            aImg.Save(mS, System.Drawing.Imaging.ImageFormat.Jpeg); //保存图片

            sImg.Dispose();
            aImg.Dispose();
            g.Dispose();
        }
        catch
        {
            Bitmap aImg = new Bitmap(width, height);
            Graphics g = Graphics.FromImage(aImg);
            g.Clear(Color.White);

            aImg.Save(mS, System.Drawing.Imaging.ImageFormat.Jpeg); //保存图片

            aImg.Dispose();
            g.Dispose();
        }
        
        return mS;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}