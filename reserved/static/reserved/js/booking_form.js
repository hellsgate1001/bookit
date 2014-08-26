
;(function(window){
	var easyDateInput = function(selector){
		var verifying = false;

		var showHelp = function($help, type, data){
			var textTemplate = $('.' + type + '-date-input').html();
			var html = sprintf(textTemplate, data)
			$help.html( $('<span/>', {
				'class': type
				, 'html': html
			}) )
		}

		var verifyDate = function(el, $help){

			if(verifying) {
				// console.log('Already verifying')
				return false;
			}


			window.setTimeout( (function(){
				var self = this.element;
				verifying = true;
				var text = $(self).val();
				var $help = this.$help;

				return function() {
					var val = $(self).val();

					if(val == '') {
						verifying = false;
						return;
					}
					if(val !== text) {
						// console.log('skipping');
						// restack a reapply.
						window.setTimeout(function(){
							console.log('recheck')
							verifying = false;
							verifyDate(self, $help);
						}, 200);
					} else {

						var date = Date.parse( val );
						console.log('Performing', val, date);
						var formatted
						var type = 'invalid';

						if( date !== undefined
							&& date !== null) {
							type = 'valid';
							formatted = moment(date).format('dddd Do MMMM YYYY, h:mm:ss a');
							$(self).addClass('valid').removeClass('invalid checking')
						} else {
							$(self).addClass('invalid').removeClass('valid checking')

						}

						showHelp($help, type, {
							type:type
							, text: val
							, formatted: formatted
						});

						// console.log('Done', (date) ? 'good': 'bad')
						verifying = false;
					}
				}

			}).apply({ element: el, $help: $help }), 500);

			return true
		};

		$(selector).keyup(function(e){
			var $this = $(this);
			var $help = $this.next().next();
			if( !$help.data('lastText')) {
				$help.data('lastText', $help.text() );
			}

			if( $this.val().trim() == '' ) {

				$help.text($help.data('lastText'));
				$this.removeClass('checking invalid valid')
			}

			if( verifyDate(this, $help) ) {
				showHelp($help, 'checking', {});
				$this.addClass('checking').removeClass('invalid valid')
			}
		})
	}

	$(document).ready(function(){
		easyDateInput('#id_arrival, #id_depature')
	})

})(window)
