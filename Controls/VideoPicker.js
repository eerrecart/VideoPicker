//variable global donde se almacenan los videos que el usuario esta gestionando
var repo = new Object();

$(document).ready(function () {
    BackToTheFuture();
    
    

    repo.opts = {
                    contentId: "ContentIdValue_",
                    previewHolder: "preview_",
                    imgViewerHolder: "ImgViewer_",
                    title: "title_"
    };

    //obtengo los valores ya almacenados
    if ($("#valuesHolder").val() != undefined && $("#valuesHolder").val())
        repo.videos = JSON.parse($("#valuesHolder").val());
    else
        repo.videos = null;

    ReloadList();
});


function BackToTheFuture()
{
    if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
        alert('En este Plug In, no hay lugar para los débiles, conseguí un navegador de esta decada: http://www.google.com/Chrome');
    } 
}

function BindEvents() {
    //configuro el enter para que no haga submit cuando se presiona en los campos de texto
    $(':input', ".vpHolder").keypress(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13)
            return false;
    });
    $(".vpHolder").keyup(EnterKeyCallback);
    $(".vpAddMediaLnk").click(ChangeMedia);
    $(".vpRemoveMediaLnk").click(RemoveMedia);

}

// configura el evento del presionado de cualquier tecla con la actualización de items, o creación de un item nuevo 
// cuando se apreta ENTER, depnendiendo desde donde se este invocando este evento
function EnterKeyCallback(e) {
    if ($(e.currentTarget).hasClass("newItem")) {
        if (e.which == 13) {
            AddVideo();
        } 
    } else {
        
        if (e.which == 13) {
            return false;
        } else {
            UpdateItem(e.currentTarget);
        }
    }    
}

//Hack for cross browsing, place holders for non HTML 5 compatible browsers
function PlaceHoldersSetup()
{
    $('[placeholder]').focus(function () {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
}

//Agrega a cada uno de los videos actuales la configuracion de la API de umbraco para el Media Picker nativo.
function AttachMediaChooser(repo)
{
    $(repo.videos).each(function () {
        //proxy context
        var that = this;
        this.mediaChooser = new Umbraco.Controls.MediaChooser('Choose Media',
                                                                repo.opts.contentId + this.id,
                                                                repo.opts.previewHolder + this.id,
                                                                repo.opts.imgViewerHolder + this.id,
                                                                repo.opts.title + this.id,
                                                                '/umbraco/dialogs/mediaPicker.aspx',
                                                                530,
                                                                565,
                                                                '/umbraco');

        //extiendo la funcionalidad de save para poder refrescar el 
        //repositorio de objetos con el media que se selecciono
        var oldSaveSelection = this.mediaChooser.SaveSelection;

        this.mediaChooser.SaveSelection = function (e) {
            oldSaveSelection.call(that.mediaChooser, e);
            UpdateItem(that.mediaChooser.source);
        }
        // lo mismo para el clear
        var oldClearSelection = this.mediaChooser.ClearSelection;

        this.mediaChooser.ClearSelection = function (e) {
            oldClearSelection.call(that.mediaChooser, e);
            UpdateItem(that.mediaChooser.source);
        }
        
        // recargo las imagenes ya previamente seleccionadas, para que se muestren.
        // esto sirve cuando con la primer carga ya hay datos almacenados, y hay que notificar a la 
        // api que muestre el mediaId asociado.
        if (this.mediaId) {
            var arg = new Object();
            arg.outVal = this.mediaId;
            oldSaveSelection.call(that.mediaChooser, arg);
        }

    });
}

// Agrega un video al repositorio y también al listado html
function AddVideo()
{
    var newVideo = new Object();

    newVideo.id = repo.videos.length;
    newVideo.title = $(".newItem .vpTitle").val();
    newVideo.desc = $(".newItem .vpDesc").val();
    newVideo.hash = $(".newItem .vpHash").val();
    newVideo.mediaId = "";

    repo.videos.push(newVideo);

    ReloadList();
}

//Actualiza los valores de un item existente con los nuevos datos ingresados
function UpdateItem(videoElement) {

    var senderIndex = $(videoElement).data("index");

    repo.videos[senderIndex].title = $(videoElement).find(".vpTitle").val();
    repo.videos[senderIndex].hash = $(videoElement).find(".vpHash").val();
    repo.videos[senderIndex].desc = $(videoElement).find(".vpDesc").val();
    repo.videos[senderIndex].mediaId = $(videoElement).find(".vpMediaId").val();
    
    UpdateValuesHolder();
}

//Quita un video y vuelve a generar la relación de indices de la tabla HTML para que se corresponda
// con la longitud del array actualizado
function RemoveVideo(videoElement)
{
    repo.videos.splice($(videoElement).data("index"), 1);
    //refresco indices antes de re-bindear la grilla
    $(repo.videos).each(
        function (ix, data) {
            data.id = ix;
        }
    );

    ReloadList();
    
}

//Actualiza el thumbnail seleccionado para el video
function ChangeMedia(e)
{
    var senderIndex = $(e.currentTarget).parents('.vpHolder').data("index");

    //sender element.
    repo.videos[senderIndex].mediaChooser.source
        = $(e.currentTarget).parents('.vpHolder'); 
    repo.videos[senderIndex].mediaChooser.LaunchPicker();
}

function RemoveMedia(e)
{
    var senderIndex = $(e.currentTarget).parents('.vpHolder').data("index");
    //sender element.
    repo.videos[senderIndex].mediaChooser.source
        = $(e.currentTarget).parents('.vpHolder'); 
    repo.videos[senderIndex].mediaChooser.ClearSelection();

}

//recarga el listado html bindeando con los valores actualizados desde el data source, 
//y re asigna eventos y propiedades a los nuevos elementos agregados. 
//Tambien persiste el json data source en el HTML
function ReloadList()
{
    var template = $("#templateHolder").html();

    var output = Mustache.to_html(template, repo);
    $("#listWrapper").html(output);

    // quite el script del template, porque con IE falla el parseo de mustashe.js
    $("#listWrapper").append(" <script type='text/javascript'>var opts = { umbPath: '/umbraco', style: 'ImageLink', linkTarget: '_blank' };console.log('UmbracoImageViewer');if (jQuery.isReady) {jQuery('.imageViewer').UmbracoImageViewer(opts);}else {jQuery(document).ready(function () {jQuery('.imageViewer').UmbracoImageViewer(opts);});}</script>");

    
    
    UpdateValuesHolder();
    AttachMediaChooser(repo);
    BindEvents();
    PlaceHoldersSetup();
}

// quito funciones helpers y propiedades directamente relacionadas al 
// funcionamiento de la UI para no serializarlas en el objeto que se va a guardar en la base de datos.
function UpdateValuesHolder()
{
    var videoData = $.map(repo.videos, function (video) {
        return {    id : video.id, 
                    title: video.title, 
                    hash: video.hash, 
                    desc: video.desc, 
                    mediaId: (video.mediaId)? video.mediaId: 0 
                };
    });
    
    $("#valuesHolder").val(JSON.stringify(videoData));
}