var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");
    	
var Profile = function () { 
	
	var handleInputPhone = function() 
	{
		if(!jQuery().autoNumeric) {
			return;
		}
		
		$('input[name="mobilephone"]').autoNumeric('init', {
    		aSep: '',
    		vMin: 0,
    		vMax: 99999999999,
    		lZero: 'keep',
    		aPad: false,
    		aForm: false
    	});
	};
	
	var handleBirthdayPicker = function() 
	{
		if(!jQuery().birthdayPicker) {
			return;
    	};
    	
    	var $userBirthday = $('#birthdayPicker'),
		userDefaultDate = $userBirthday.attr('data-default-date');
	
		$userBirthday.birthdayPicker({
			sizeClass: 'form-control',
			defaultDate: (userDefaultDate != '') ? userDefaultDate : false,
			dateFormat: 'littleEndian',
		});
	};
	
	var handleInputPrice = function()
	{
		if(!jQuery().autoNumeric) {
	    	return;
    	};
    	
    	var inputPrice = $('input.price-vnd').autoNumeric('init', {
    		aSep: ',',
    		vMin: 1,
    		vMax: 999999,
    		aPad: false,
    		aForm: false
    	});
	
		inputPrice.on("focusout", function() {
			var a = inputPrice.autoNumeric('get');
			$("#tprice").text(DocTienBangChu(a))
	    }).on("keyup", function() {
	    	var a = inputPrice.autoNumeric('get');
	    	$("#tprice").text(DocTienBangChu(a))
	    });
		
		inputPrice.trigger('keyup');
		
    	function DocSo3ChuSo(e) {
    	    var c;
    	    var b;
    	    var a;
    	    var d = "";
    	    c = parseInt(e / 100);
    	    b = parseInt((e % 100) / 10);
    	    a = e % 10;
    	    if (c == 0 && b == 0 && a == 0) {
    	        return ""
    	    }
    	    if (c != 0) {
    	        d += ChuSo[c] + " trăm ";
    	        if ((b == 0) && (a != 0)) {
    	            d += " linh "
    	        }
    	    }
    	    if ((b != 0) && (b != 1)) {
    	        d += ChuSo[b] + " mươi";
    	        if ((b == 0) && (a != 0)) {
    	            d = d + " linh "
    	        }
    	    }
    	    if (b == 1) {
    	        d += " mười "
    	    }
    	    switch (a) {
    	        case 1:
    	            if ((b != 0) && (b != 1)) {
    	                d += " mốt "
    	            } else {
    	                d += ChuSo[a]
    	            }
    	            break;
    	        case 5:
    	            if (b == 0) {
    	                d += ChuSo[a]
    	            } else {
    	                d += " lăm "
    	            }
    	            break;
    	        default:
    	            if (a != 0) {
    	                d += ChuSo[a]
    	            }
    	            break
    	    }
    	    return d
    	}
    	
    	function DocTienBangChu(d) {
    	    var a = 0;
    	    var c = 0;
    	    var f = 0;
    	    var e = "";
    	    var b = "";
    	    var g = new Array();
    	    if (d < 0) {
    	        return ""
    	    }
    	    if (d == 0) {
    	        return ""
    	    }
    	    if (d > 0) {
    	        f = d
    	    } else {
    	        f = -d
    	    }
    	    if (d > 8999999999999999) {
    	        return "Số quá lớn!"
    	    }
    	    g[5] = Math.floor(f / 1000000000000000);
    	    if (isNaN(g[5])) {
    	        g[5] = "0"
    	    }
    	    f = f - parseFloat(g[5].toString()) * 1000000000000000;
    	    g[4] = Math.floor(f / 1000000000000);
    	    if (isNaN(g[4])) {
    	        g[4] = "0"
    	    }
    	    f = f - parseFloat(g[4].toString()) * 1000000000000;
    	    g[3] = Math.floor(f / 1000000000);
    	    if (isNaN(g[3])) {
    	        g[3] = "0"
    	    }
    	    f = f - parseFloat(g[3].toString()) * 1000000000;
    	    g[2] = parseInt(f / 1000000);
    	    if (isNaN(g[2])) {
    	        g[2] = "0"
    	    }
    	    g[1] = parseInt((f % 1000000) / 1000);
    	    if (isNaN(g[1])) {
    	        g[1] = "0"
    	    }
    	    g[0] = parseInt(f % 1000);
    	    if (isNaN(g[0])) {
    	        g[0] = "0"
    	    }
    	    if (g[5] > 0) {
    	        a = 5
    	    } else {
    	        if (g[4] > 0) {
    	            a = 4
    	        } else {
    	            if (g[3] > 0) {
    	                a = 3
    	            } else {
    	                if (g[2] > 0) {
    	                    a = 2
    	                } else {
    	                    if (g[1] > 0) {
    	                        a = 1
    	                    } else {
    	                        a = 0
    	                    }
    	                }
    	            }
    	        }
    	    }
    	    for (c = a; c >= 0; c--) {
    	        b = DocSo3ChuSo(g[c]);
    	        e += b;
    	        if (g[c] > 0) {
    	            e += Tien[c]
    	        }
    	        if ((c > 0) && (b.length > 0)) {
    	            e += ","
    	        }
    	    }
    	    if (e.substring(e.length - 1) == ",") {
    	        e = e.substring(0, e.length - 1)
    	    }
    	    e = e.substring(1, 2).toUpperCase() + e.substring(2);
    	    e = $.trim(e);
    	    e = e + " đồng";
    	    return e
    	}
	};
	
	var handleAcademicTutors = function() 
	{
		if(!jQuery().bootstrapWizard) {
			return;
    	}
		
		$('#tutorWizard').bootstrapWizard({
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $('#tutorWizard').find('.pager .next').hide();
                    $('#tutorWizard').find('.pager .finish').removeClass('hidden').show();
                    $('#tutorWizard').find('.pager .finish').removeClass('disabled');
                    $('#tutorWizard').find('.pager .previous').hide();
                } else {
                    $('#tutorWizard').find('.pager .next').show();
                    $('#tutorWizard').find('.pager .previous').show();
                    $('#tutorWizard').find('.pager .finish').hide();
                }

                App.scrollTo($('#tutorWizard'));

                var li = navigation.find('li.active');

                var btnNext = $('#tutorWizard').find('.pager .next').find('button');
                var btnPrev = $('#tutorWizard').find('.pager .previous').find('button');

            },
            onInit: function() {
                $('#tutorWizard ul').removeClass('nav-pills');
            }
        });
	};
	
	var handleUploadPhoto = function() 
	{
		if(jQuery().croppie) {
			var $userPhoto = $('#croppie-user-photo');
	    	var $uploadCrop = $('#croppie-user-photo .croppie-upload-crop');
	    	
	    	function base64ToBlob(base64, mime) {
	    	    mime = mime || '';
	    	    var sliceSize = 1024;
	    	    var byteChars = window.atob(base64);
	    	    var byteArrays = [];
	
	    	    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
	    	        var slice = byteChars.slice(offset, offset + sliceSize);
	
	    	        var byteNumbers = new Array(slice.length);
	    	        for (var i = 0; i < slice.length; i++) {
	    	            byteNumbers[i] = slice.charCodeAt(i);
	    	        }
	
	    	        var byteArray = new Uint8Array(byteNumbers);
	
	    	        byteArrays.push(byteArray);
	    	    }
	
	    	    return new Blob(byteArrays, {type: mime});
	    	}
	    	
			function readFile(input) {
	 			if (input.files && input.files[0]) {
		            var reader = new FileReader();
		            
		            reader.onload = function (e) {
		            	$uploadCrop.croppie('bind', {
		            		url: e.target.result
		            	});
		            	$userPhoto.addClass('ready');
		            }
		            
		            reader.readAsDataURL(input.files[0]);
		        }
		        else {
			        swal("Sorry - you're browser doesn't support the FileReader API");
			    }
			}
	
			$uploadCrop.croppie({
				viewport: {
					width: 150,
					height: 150,
					type: 'square'
				},
				boundary: {
					width: 158,
					height: 158,
				},
				
			});
	
			$userPhoto.on('change', 'input[name="avatar"]', function () { readFile(this); });
			
			$userPhoto.on('click', 'button.upload-result', function (ev) {
				$uploadCrop.croppie('result', {
					type: 'canvas',
					size: 'viewport'
				}).then(function (resp) {
					$userPhoto.find('.profile-photo>img').attr('src', resp);
					$userPhoto.removeClass('ready');
					
					var b64Data = resp.replace("data:image\/png;base64,", "");
					var blob = base64ToBlob(b64Data, "image/png");
					
					var formData = new FormData();
					formData.append('avatar', blob, "cropped.png");
					
					$.ajax({
					    url: $userPhoto.attr('data-url'),
					    type: "POST", 
					    cache: false,
					    contentType: false,
					    processData: false,
					    data: formData
					}).done(function(response) {
						if(response.status == 'error') {
							alert(response.msg);
						}
					});
				});
			});
		}
	};
	
	
	return {
	    init: function () {
	    	handleBirthdayPicker();
	    	handleInputPrice();
	    	handleAcademicTutors();
	    	handleUploadPhoto();
	    },
	    
		initUpdateProfile: function(){
			handleBirthdayPicker();
			handleInputPhone();
		},
		
	    initUploadPhoto: function() {
	    	handleUploadPhoto();
	    },
		
		initTeachingSubjects: function() 
		{
			handleInputPrice();
		},
	}
}();

jQuery(document).ready(function($) {
	Profile.init();
	
	var DASHBOARD_SECTION = 'div.dashboard-section';

	$(document).on('ifToggled', 'input.checkall', function() {
		var $children = $(this).parentsUntil('.form-group').find('input[type="checkbox"]');
		if(this.checked) {
			$children.iCheck('check');
		} else {
			$children.iCheck('uncheck');
		}
	});
	
	$(document).on('change', 'select[name="province_id"]', function() {
		$('form .location-group').hide();
		$('#location_group_' + this.value).show();
	});
	
	$('select[name="province_id"]').trigger('change');			
	
	$(document).on('click', '.edit-section', function (e) {
		e.preventDefault();
		$(this).attr('disabled', true);
		$(this).html("<i class='fa fa-spinner fa-spin fa-fw'></i> loading...");

		var url = $(this).attr('href');
		var currentSection = $(this).parentsUntil(DASHBOARD_SECTION).parent();
		var sectionName = currentSection.attr('data-section');

		$.ajax({
            type: "GET",
            url: url,
            dataType: 'html',
            success: function(data) {
            	currentSection.hide();
				currentSection.html(data).fadeIn("fast");
				
				if(sectionName == 'profile') {
					Profile.initUpdateProfile();
				} else if(sectionName == 'teaching_subjects') {
					Profile.initTeachingSubjects();
				}

				App.initAjax();
				App.scrollTo(currentSection);
            }
        });
	});
	
	$(document).on('click', 'form input[type=submit]', function () {
		$(this).attr("clicked", "true");
	});
	
	$(document).on('submit', 'form.update-profile-form', function (e) {
		var $form = $(this);
		var submitBtn = $("input[type=submit][clicked=true]");
		var submitVal = submitBtn.attr('name').toLowerCase();

		submitBtn.val('Đang lưu...');

		if (submitVal == 'cancel') {
			submitBtn.val('Đang hủy...');
		}
		
		$form.find('.form-group').removeClass('has-error');
		$form.find('.help-block').remove();
		$form.find('input[type=submit]').prop('disabled', true);

		e.preventDefault();
		
		var currentSection = $form.parentsUntil(DASHBOARD_SECTION).parent();
		
		var payload = $(this).serialize();
		payload += '&submit=' + submitVal;
		var url = $(this).attr('action');

		$.ajax({
            type: "POST",
            url: url,
            data: payload,
            success: function(response, status, xhr) {
            	$form.find('input[type=submit]').prop('disabled', false);
            	if (submitVal == 'submit') {
        			submitBtn.val('Lưu thay đổi');
        		}
            	
            	var ct = xhr.getResponseHeader("content-type") || "";
                if (ct.indexOf('text/html') > -1) {
                	currentSection.hide();
    				currentSection.html(response).fadeIn("fast");
    				Profile.initUploadPhoto();
    				App.scrollTo(currentSection);
                } else if (ct.indexOf('application/json') > -1) {
                	$.each(response.msg, function(n, err) {
                    	$form.find('label[for="'+n+'"]').parent('div.form-group').addClass('has-error');
                    	$.each(err, function(c, m) {
                    		$form.find('label[for="'+n+'"]').parent('div.form-group').append('<div class="help-block">'+m+'</div>');
                        });
                    });
                }
            }
        });
	});
	
	$(document).on('submit', 'form.update-teaching-form', function (e) {
		var $form = $(this);
		var submitBtn = $("input[type=submit][clicked=true]");
		var submitVal = submitBtn.attr('name').toLowerCase();

		submitBtn.val('Đang lưu...');

		if (submitVal == 'cancel') {
			submitBtn.val('Đang hủy...');
		}
		
		$form.find('.form-group').removeClass('has-error');
		$form.find('.help-block').remove();
		$form.find('input[type=submit]').prop('disabled', true);

		e.preventDefault();
		
		var currentSection = $form.parentsUntil(DASHBOARD_SECTION).parent();
		
		var payload = $form.serialize();
		payload += '&submit=' + submitVal;
		var url = $(this).attr('action');

		$.ajax({
            type: "POST",
            url: url,
            data: payload,
            success: function(response, status, xhr) {
            	$form.find('input[type=submit]').prop('disabled', false);
            	if (submitVal == 'submit') {
        			submitBtn.val('Lưu thay đổi');
        		}
            	
            	var ct = xhr.getResponseHeader("content-type") || "";
                if (ct.indexOf('text/html') > -1) {
                	currentSection.hide();
    				currentSection.html(response).fadeIn("fast");
    				App.scrollTo(currentSection);
                } else if (ct.indexOf('application/json') > -1) {
                	$.each(response.msg, function(n, err) {
                    	$form.find('label[for="'+n+'"]').parent('div.form-group').addClass('has-error');
                    	$.each(err, function(c, m) {
                    		$form.find('label[for="'+n+'"]').parent('div.form-group').append('<div class="help-block">'+m+'</div>');
                        });
                    });
                }
            }
        });
	});
});