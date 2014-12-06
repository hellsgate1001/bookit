
;(function(window){

	$(document).ready(function(){
		easyDateInput('#id_start_time, #id_end_time');

		$('form.booking-form').on('submit', function(){
			$('#id_start_time, #id_end_time').each(function(i, e){
				var d = $(e).data('date');
				var fd = moment( d ).format('YYYY-MM-DD HH:MM:SS');

				$(e).val( fd );
			})
		})
	})

})(window)
