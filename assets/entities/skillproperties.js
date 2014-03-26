Game.SkillProperties = {};

Game.SkillProperties.HasAmmo = {
	name: 'HasAmmo',
	init: function(properties) {
		this._ammo =  properties['ammo'];
	},
	getAmmo: function() {
		return this._ammo;
	},
	modifyAmmo: function(num) {
		this._ammo += num;
	}
};

Game.SkillProperties.Toggleable  = {
	name: 'Toggleable',
	init: function() {
		this._toggled = false; 
	},
	isToggled: function() {
		return this._toggled;
	},
	toggle: function() {
		this._toggled = (this._toggled) ? false : true;
		if (this.getOtherInfo('toggleAction') !== undefined) {
			var toggleAction = this.getOtherInfo('toggleAction').bind(this);
			toggleAction(this._toggled);
		}
	}
};

Game.SkillProperties.CreatesEntity = {
	name: 'CreatesEntity',
	init: function(properties) {
		this._entity = undefined;
		this._entityTemplate = properties['entityTemplate'];
	},
	getEntity: function() {
		return this._entity;
	},
	createEntity: function(map,l,x,y) {
		this._entity = new Game.Entity(this._entityTemplate);
		this._entity.setOwner(this._source);
		map.addEntity(this._entity, l, x, y);
		return this._entity;
	},
	removeEntity: function(map) {
		map.removeEntity(this._entity);
		this._entity = undefined;
	}
};
