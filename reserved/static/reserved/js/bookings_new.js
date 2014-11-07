
;(function(window){

	$(document).ready(function(){

		$('#id_arrival').keyup(function(e){
			console.log(Date.parse( $(this).val() ))
		})
	})

})(window)
