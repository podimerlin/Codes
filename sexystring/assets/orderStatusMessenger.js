(function() {
    var loadScript = function(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") { script.onreadystatechange = null;
                    callback(); } }; } else { script.onload = function() { callback(); }; }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script); 
    };

    var fix = function($) {
        var url = 'https://www.modules4u.biz/shopify/order-status-messenger/cid.php';

        function m4uRequest(path, method, vals) { 
            vals['shop'] = 'stickybra.myshopify.com';
            $.ajax({ url: path, type: method, crossDomain: true, data: vals, dataType: 'json', success: function(data) {
                    var sig = data['ref'];
                    var sub = data['subscribed'];
                    $('.fb-send-to-messenger').attr('data-ref', sig);
                    if (sub) { 
                        $('#unlink_div').show();
                        $('#messenger_div').hide(); 
                    } else { 
                        fb();
                        $('#unlink_div').hide();
                        $('#messenger_div').show(); 
                    }
                    if (typeof data == 'undefined') {
                      location.reload();
                    }
                }, error: function(request, error) { console.log(JSON.stringify(request)); } 
            }); 
        }

        function fb() { 
            window.fbAsyncInit = function() { 
                FB.init({ appId: "299636810391481", xfbml: true, version: "v2.6" });
                FB.getLoginStatus(function(response) { statusCallback(response); }, true); 
            };
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return; }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs); 
            }(document, 'script', 'facebook-jssdk')); 
        }
        
        $(document).ready(function() {
            var ref = $('.fb-send-to-messenger').attr('data-ref');
            $('#unlink').on('click', function() { 
                m4uRequest(url, 'POST', { 'action': 'unlink', 'cid': ref });
              	//location.reload();
            });
            m4uRequest(url, 'POST', { 'action': 'sign', 'cid': ref }); 
        }); 
    };

    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) { 
        loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() { 
            jQuery191 = jQuery.noConflict(true);
            fix(jQuery191); 
        }); 
    } else { 
        fix(jQuery); 
    }
  
  	$('div.fb-send-to-messenger body form span').click(function(){
            $('#unlink_div').show();
            $('#messenger_div').hide(); 
      });
     $('#unlink_div input').click(function(){
      });
  
})();
