(function(){

	// http://www.collectionsjs.com/
	var CollectionMixin = Application.mixins.CollectionMixin = Application.Class({
		collection: function(){
		}
	})
	Application.prototype.mixins.CollectionMixin = CollectionMixin;
	Application.CollectionMixin = CollectionMixin;
	Application.extend(Application, [CollectionMixin])
})()
