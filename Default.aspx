<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VideoPicker.Default" %>
<%@ Register Assembly="Umbraco.VideoPicker" Namespace="VideoPicker.Controls" TagPrefix="custom"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/jquery-ui.min.js" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <custom:VideoPicker runat="server" ID="videoPicker" Maximum="11" AddCaption="Caption"></custom:VideoPicker>

        <asp:Button runat="server" ID="btnSave" OnClick="btnSave_Click" Text="Guardar"/>
    </div>
    </form>
</body>
</html>
