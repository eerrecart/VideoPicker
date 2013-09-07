using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using umbraco.editorControls.userControlGrapper;
using umbraco.cms.businesslogic.datatype;

namespace VideoPicker
{
    public partial class VideoPickerDatatype : System.Web.UI.UserControl
        , umbraco.editorControls.userControlGrapper.IUsercontrolDataEditor
    {

        [DataEditorSetting("maximum", description = "maximum number of items allowed")]
        public string Maximum { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                customControl.Values = values;
            }
        }

        private string values;

        public object value
        {
            get
            {
                return customControl.Values;
            }
            set
            {
                if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                    values = "[]"; //empty representation for a json value.
                else
                    values = value.ToString();

            }
        }
    }
}