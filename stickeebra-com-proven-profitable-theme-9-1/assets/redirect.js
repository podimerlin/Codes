var prdmap = {'angel' : "/collections/stickeebra/products/angel-lacing-stickeebra",
       'bundle' : "/collections/stickeebra/products/stickee-bundle",
       'front' : "/collections/stickeebra/products/front-lacing-stickeebra",
       'stickeebra' : "/collections/stickeebra/products/stickeebra",
       'wings' : "/collections/stickeebra/products/wings-stickeebra",
       'pasties' : "/collections/stickeebra/products/sticky-pasties",
       'floral' : "/collections/stickeebra/products/floral-laces-stickeebra",
       'invis' : "/collections/stickeebra/products/invis-stickeebra"
      };

var prd = getParameterByName('prd');

if (prdmap.hasOwnProperty(prd)) {
	window.location = prdmap[prd];
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}