Umbraco.VideoPicker
=======
Package for umbraco **4.x/6.x** that allows store multiples videos URL's with extra properties (also can be used to save lists of asstes, like media, links, pdf's, etc).

**properties:**

*   Id 
*   Title
*   Hash    *(Url or identifier that point to the asset)*
*   Description
*   Media Id *(Provided by the native media picker of umbraco)*

**The list of videos or assets are stored in JSON fromat with the next structure:**

```
[
    {
        "id": 0,
        "title": "title of video",
        "hash": "http://vimeo.com/user12113503/httpvimeocomthejackal",
        "desc": "Description for video 0",
        "mediaId": "1052"
    },
    {
        "id": 1,
        "title": "title of video 2",
        "hash": "http://youtu.be/_646NA4sxJ8",
        "desc": "",
        "mediaId": "1049"
    },
    {
        "id": 2,
        "title": "title of video 3",
        "hash": "http://video.mp4",
        "desc": "lorem ipsum",
        "mediaId": "1051"
    }
]
```
Umbraco Package Installer
=======

[Umbraco.VideoPicker]() (Working on umbraco v4.x and v6.x)

Umbraco Package Example Installer
=======

[Umbraco.VideoPicker.Example]() (Working on umbraco v6.x)

This macro (can be easly refactored to work in umbraco **v4.x**) shows how to query the data stored form the VideoPicker and get it on the front end page, and then using embed.ly (uses [oEmbed](http://oembed.com/) standard) provider get videos from: *youtube*, *vimeo*, or any other supported by embed.ly.
Also you can build your own provider.
