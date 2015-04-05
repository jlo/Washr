// KPR Script file
var THEME = require('themes/sample/theme');
var BUTTONS = require("controls/buttons");

var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );

var tabStyle = new Style( { font: "bold 15px", color:"white" } );

//tab template
var buttonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, top: $.top, height:20, name:$.name, skin:blackSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

//tabs
var hamper = new buttonTemplate({leftPos:80,width:80, bottom:0,  textForLabel: "Hamper"});
var machines = new buttonTemplate({leftPos:160, width:80, bottom:0, textForLabel: "Machines"});
var credits = new buttonTemplate({leftPos:240, width:80, bottom:0, textForLabel:"Credits"});

var containerTemplate = Container.template(function($) { return {
	left: 0, right: 0, top: 0, bottom: $.bottom, skin: whiteSkin, active: true,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});

//containers
var machinesCon = new containerTemplate({bottom: 20});
var hamperCon = new containerTemplate({bottom:20});
var creditsCon = new containerTemplate({bottom:20});

var mainContainer = new containerTemplate({bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);
application.add(mainContainer);
