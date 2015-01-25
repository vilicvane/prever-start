using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace Prever
{
    public class Settings
    {
        public class Path : System.Web.SessionState.IRequiresSessionState
        {
            public static string DiskPath = "Disk for Prever\\"; //可更改
            public static string SystemPath = "System for Prever\\"; //可更改

            public static string DiskDrive = "Disk:";
            public static string SystemDrive = "System:";
        }
    }
}