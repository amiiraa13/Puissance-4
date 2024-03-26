/*
 * DC jQuery Slick Forms - jQuery Slick Forms
 * Copyright (c) 2011 Design Chemical
 * http://www.designchemical.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 */
function grecaptchaGenerateToken($form, check, emailReg,defaults, $loading, formAction, textEmail,$error, textError){
    grecaptcha.ready(function() {
        // do request for recaptcha token
        // response is promise with passed token
        grecaptcha.execute(GOOGLE_CAPTCHA_SITE, {action:'validate_captcha'})
            .then(function(token) {
                // add token value to form
                let _recaptcha = document.getElementById('g-recaptcha-response');
                if(_recaptcha != null){
                    document.getElementById('g-recaptcha-response').value = token;
                    //console.log(document.getElementById('g-recaptcha-response').value);
                    //console.log($form);
                    if($form) {
                        $($form).submitData($form, token, check, emailReg,defaults, $loading, formAction, textEmail,$error, textError);
                    }
                }
            });
    });

}

function replaceSerializeOptionVal($, serializedData, option, val)
{
    if($ && serializedData && option && val && serializedData.indexOf('=') > -1){
        let dataArray = $.parseParams(serializedData);

        // Loop through the array to find and modify the desired option value
        $.each(dataArray, function(index, item) {
            if (item.name === option) {
                item.value = val;
                return false; // Exit the loop once the option is found and modified
            }
        });

        // Convert the modified array back to a serialized string
        return $.param(dataArray);
    }
    return serializedData;
}

function formReset(obj,defaults) {
    $('li', obj).removeClass('error');
    $('span.error', obj).remove();
    masonryHeight(obj,defaults);
}

function masonryHeight($form,defaults) {
    //console.log(defaults);
    var q = $('li.error', $form).length;
    if (q > 0) {
        var x = horig + (q * defaults.errorH);
        $('.boxes.masoned').animate({height: x + 'px'}, 400);
    }
}

function generateAlert(UIkit,data, imageSrc) {
    var dialogContent;

    if (typeof UIkit.modal !== "undefined") {

        dialogContent = "<div id=\"subscription-dialog\" class=\"uk-flex-top uk-flex tm-footer-form-modal\" data-uk-modal>" +
            "<div class=\"uk-modal-dialog uk-modal-body uk-text-center uk-margin-auto-vertical\">" +
            "<button class=\"uk-modal-close-default uk-close-large\" type=\"button\" data-uk-close></button>" +
            "<div class=\"uk-margin\">" +
            "<img width=\"50\" height=\"50\"" +
            "src=" + imageSrc + " alt=" + data + ">" +
            "</div>" +
            "<div class=\"uk-margin\">" + data + "</div>" +
            "</div>" +
            "</div>";

    } else if (typeof $.fancybox !== "undefined") {

        dialogContent = "<div class=\"subscription-dialog\">" +
            "<div class='subscription-img-block'><img width='50' height='50' " +
            "src='" + imageSrc + "' alt='" + data + "'></div>" +
            "<div class='subscription-text-block'>" + data + "</div>" +
            "</div>";

    }
    return dialogContent;
}
(function ($) {
    var re = /([^&=]+)=?([^&]*)/g;
    var decode = function(str) {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    };
    $.parseParams = function(query) {
        var params = {}, e;
        if (query) {
            if (query.substr(0, 1) == '?') {
                query = query.substr(1);
            }

            while (e = re.exec(query)) {
                var k = decode(e[1]);
                var v = decode(e[2]);
                if (params[k] !== undefined) {
                    if (!$.isArray(params[k])) {
                        params[k] = [params[k]];
                    }
                    params[k].push(v);
                } else {
                    params[k] = v;
                }
            }
        }
        return params;
    };
    //define the plugin
    $.fn.dcSlickForms = function (options) {

        console.log("slickforms");

        //set default options
        var defaults = {
            classError: 'error',
            classForm: 'slick-form',
            align: 'left',
            animateError: true,
            animateD: 10,
            ajaxSubmit: true,
            errorH: 24,
            successH: 40
        };

        //call in the default otions
        var options = $.extend(defaults, options);

        //act upon the element that is passed into the design
        return this.each(function (options) {
            grecaptchaGenerateToken();
            //console.log(this);

            // Declare the function variables:
            var formAction = $(this).attr('action');
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            var textError = $('.v-error', this).val();
            var textEmail = "Enter a valid email";
            var $error = $('<span class="error"></span>');
            var $form = this;
            var $loading = $('<div class="loading"><span></span></div>');
            var errorText = '* Required Fields';
            var check = 0;

            $('input', $form).focus(function () {
                $(this).addClass('focus');
            });
            $('input', $form).blur(function () {
                $(this).removeClass('focus');
                masonryHeight($form,defaults);
            });
            $('.nocomment').hide();
            $('.defaultText', $form).dcDefaultText();
            $('.' + defaults.classForm + ' label').hide();

            // Form submit & Validation
            $($form).submit(function (event) {
                event.preventDefault();
                //console.log(this);
                grecaptchaGenerateToken(this,check,emailReg,defaults, $loading, formAction, textEmail,$error, textError);

                // Prevent form submission
                return false;
            });

            // Fade out error message when input field gains focus
            $('input, textarea').focus(function () {
                var $parent = $(this).parent();
                $parent.addClass('focus');
                $parent.removeClass('error');

            });
            $('input, textarea').blur(function () {
                var $parent = $(this).parent();
                var checkVal = $(this).attr('title');
                if (!$(this).val() == checkVal) {
                    $(this).removeClass('defaulttextActive');
                }
                $parent.removeClass('error focus');
                $('span.error', $parent).hide();
            });


        });
    };

    $.fn.submitData = function($form, token, check, emailReg,defaults, $loading, formAction, textEmail, $error, textError){
        if (check == 0) {
            horig = $('#bottom-container .boxes').height();
        }
        check = 1;
        formReset($form,defaults);
        $('.defaultText', $form).dcDefaultText({action: 'remove'});

        // Validate all inputs with the class "required"
        $('.required', $form).each(function () {
            var label = $(this).attr('title');
            var inputVal = $(this).val();
            var $parentTag = $(this).parent();

            if (inputVal == '') {
                $parentTag.addClass('error');
                //$parentTag.append($error.clone().text(textError));
            }

            // Run the email validation using the regex for those input items also having class "email"
            if ($(this).hasClass('email')) {
                if (!emailReg.test(inputVal)) {
                    $parentTag.addClass('error');
                    //$parentTag.append($error.clone().text(textEmail));
                    $(".response" , $form).html("<span style='color: red;'>"+ textEmail +"</span>").fadeIn().addClass("uk-text-danger");
                }
            }

            if ($(this).attr('name') == "privacy_policy") {

                if (!$(this).is(":checked")) {
                    $(this).parent().addClass('error');
                    $(".response", $form).html("<span style='color: red;'>Agree with privacy policy</span>").fadeIn();
                } else {
                    $(this).parent().removeClass("error");
                    $(".response", $form).html("").fadeIn();
                }
            }

        });

        // All validation complete - Check if any errors exist
        // If has errors
        if ($('.error', $form).length) {
            //console.log("errors");
            //console.log($('.error', $form).length);
            masonryHeight($form,defaults);
            $('.btn-submit', $form).before($error.clone().text(textError));
        } else {
            if (defaults.ajaxSubmit == true) {

                console.log("ok");

                $(this).addClass('submit').after($loading.clone());
                $('.defaultText', $form).dcDefaultText({action: 'remove'});
                $(this).find('[name="g-recaptcha-response"]').val(token);
                //console.log($(this).serialize());
                let serializedData = $(this).serialize();
                serializedData = replaceSerializeOptionVal($, serializedData, 'g-recaptcha-response', token);
                $.post(formAction, serializedData, function (data) {

                    //console.log("data " + data);


                    grecaptchaGenerateToken();

                    $('.loading' , $form).fadeOut().remove();
                    $('.response' , $form).html(data).fadeIn().removeClass("uk-text-danger");
                    if (typeof UIkit.modal !== "undefined") {
                        UIkit.modal(generateAlert(UIkit,data, "http://fixthephoto.com/images/success.svg")).show();
                    } else if (typeof $.fancybox !== "undefined") {
                        $.fancybox.open(generateAlert(UIkit,data, "http://fixthephoto.com/images/success.svg"));
                    } else {
                        alert(data);
                    }

                    var x = horig + defaults.successH;
                    $('.boxes.masoned').animate({height: x + 'px'}, 400);
                    $('fieldset', this).slideUp();
                    jQuery($form)[0].reset();


                });
            } else {
                $form.submit();
            }
        }
    };
})(jQuery);
/*
 * DC jQuery Default Text - jQuery Default Text
 * Copyright (c) 2011 Design Chemical
 * http://www.designchemical.com
 */

(function($){

	//define the plugin
	$.fn.dcDefaultText = function(options) {
	
		//set default options
		var defaults = {
			action: 'add', // alternative 'remove'
			classActive: 'defaultTextActive'
		};

		//call in the default otions
		var options = $.extend(defaults, options);
  
		return this.each(function(options){
			
			if(defaults.action == 'add'){
			
				$(this).focus(function(srcc) {
					if ($(this).val() == $(this)[0].title) {
						$(this).removeClass(defaults.classActive);
						$(this).val('');
					}
				});
				
				$(this).blur(function() {
					if ($(this).val() == "") {
						$(this).addClass(defaults.classActive);
						$(this).val($(this)[0].title);
					}
				});
				$(this).addClass(defaults.classActive).blur();
			}
			
			if(defaults.action == 'remove'){
			
				var checkVal = $(this).attr('title');
				if ($(this).val() == checkVal){
					$(this).val('');
				}
					
			}
		});
	};
})(jQuery);