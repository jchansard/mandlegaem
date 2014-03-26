Game.TemplateReader = function(template) {
	template = template || {};
	this._properties = {};
	this._propertyGroups = {};
	this._events = {};
	var properties = template['properties'] || [];
	for (var i = 0; i < properties.length; i++) {
		for (var key in properties[i]) {
			if (key !== 'name' && key !== 'group' && key !== 'init' && key !== 'events' && !this.hasOwnProperty(key)) {
				this[key] = properties[i][key];
			} else if (key === 'name') {
				this._properties[properties[i][key]] = true;
			} else if (key === 'group') {
				this._propertyGroups[properties[i][key]] = true;
			}
		}
		if (properties[i].events !== undefined) {
			for (var key in properties[i].events) {	
				if (this._events[key] === undefined) {
					this._events[key] = [];
				}
				this._events[key].push(properties[i].events[key]);
			}
		}
		if (properties[i].init !== undefined) {
			properties[i].init.call(this, template);
		}
		this._properties[properties[i].name] = true;
	}
};

Game.TemplateReader.prototype.hasProperty = function(property) {
	return this._properties[property] || this._propertyGroups[property];
};