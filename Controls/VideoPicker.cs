using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Web.UI;

[assembly: System.Web.UI.WebResource("VideoPicker.Scripts.mustache.js", "text/js")]
[assembly: System.Web.UI.WebResource("VideoPicker.Controls.VideoPicker.js", "text/js")]
[assembly: System.Web.UI.WebResource("VideoPicker.Controls.tmpl.html", "text/js")]
[assembly: System.Web.UI.WebResource("VideoPicker.Controls.VideoPicker.css", "text/css")]
namespace VideoPicker.Controls
{
    public class VideoPicker : Panel 
    {
        private TextBox valuesHolder = new TextBox();
        private LiteralControl templateHolder = new LiteralControl("<script id=\"templateHolder\" type=\"text/x-mustache-template\">{0}</script>");
        private LiteralControl listWrapper = new LiteralControl("<div id=\"listWrapper\" >{0}</div>");
        
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            EnsureChildControls();

            if (!Page.IsPostBack)
            {
                valuesHolder.Text = Values;
            }
        }

        protected override void CreateChildControls()
        {
            valuesHolder.ClientIDMode = System.Web.UI.ClientIDMode.Static;
            valuesHolder.ID = "valuesHolder";
            valuesHolder.Attributes.Add("style", "display:none;");

            Controls.Add(valuesHolder);
            Controls.Add(listWrapper);

            umbraco.editorControls.mediaChooser lnkSelectImage =
                new umbraco.editorControls.mediaChooser(new umbraco.editorControls.mediapicker.MemberPickerDataType().Data, true, true);

            lnkSelectImage.ClientIDMode = System.Web.UI.ClientIDMode.Static;
            lnkSelectImage.ID = "thumb";

            HtmlGenericControl divMediaPickerContainer = new HtmlGenericControl("div");
            /*
             Se asocia un mediaChooser de forma oculta, dado que este control registra una serie de JS y recursos, 
             * que son necesarios para el funcionamiento del componente, pero el mismo se OCULTA para que el usuario no interactue con el
             * luego desde el JS de este componente agregaremos los Media pickers necesarios.
            */
            divMediaPickerContainer.Style.Add(System.Web.UI.HtmlTextWriterStyle.Display, "none");
            divMediaPickerContainer.Controls.Add(lnkSelectImage);
            Controls.Add(divMediaPickerContainer);

            Page.ClientScript.RegisterClientScriptInclude(
                "VideoPicker.Scripts.mustache.js",
                Page.ClientScript.GetWebResourceUrl(typeof(VideoPicker), "VideoPicker.Scripts.mustache.js"));

            Page.ClientScript.RegisterClientScriptInclude(
                "VideoPicker.Controls.VideoPicker.js",
                Page.ClientScript.GetWebResourceUrl(typeof(VideoPicker), "VideoPicker.Controls.VideoPicker.js"));

            string result = string.Empty;

            using (System.IO.Stream stream = System.Reflection.Assembly.GetExecutingAssembly()
                               .GetManifestResourceStream("VideoPicker.Controls.tmpl.html"))
            using (System.IO.StreamReader reader = new System.IO.StreamReader(stream))
            {
                result = reader.ReadToEnd();
                templateHolder.Text = string.Format(templateHolder.Text, result);
                Controls.Add(templateHolder);
            }
                        
            HtmlHead head = (HtmlHead)Page.Header;
            HtmlLink link = new HtmlLink();
            link.Attributes.Add("href", Page.ClientScript.GetWebResourceUrl(typeof(VideoPicker), "VideoPicker.Controls.VideoPicker.css"));
            link.Attributes.Add("type", "text/css");
            link.Attributes.Add("rel", "stylesheet");
            head.Controls.Add(link);
        }

        public string AddCaption { get; set; }
        public int Maximum { get; set; }
        public string Values {

            get
            {
                return valuesHolder.Text; 
            }
            set
            {
                valuesHolder.Text = value;
            }
        
        }

    }
}

namespace VideoPicker
{
    public class Video
    {
        public int id { get; set; }
        public string title { get; set; }
        public string hash { get; set; }
        public string desc { get; set; }
        public int mediaId { get; set; }
    }
}

    