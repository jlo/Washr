// KPR Script file
var THEME = require('themes/sample/theme');
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');
//skins
var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var separatorSkin = new Skin({ fill: 'silver',});
var blueSkin = new Skin( { fill:"blue" } );
var labelStyle = new Style( { font: "bold 30px", color:"black" } );
var whiteBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:5}, 
  stroke:"black"
});
//styles
var tabStyle = new Style( { font: "bold 15px", color:"white" } );
var titleStyle = new Style({font: "bold 30px", color:"black"});

washerTimeOne = 0;
washerInUseOne = 0;
washerTimeTwo = 0;
washerInUseTwo = 0;
dryerTimeOne = 0;
dryerInUseOne = 0;
dryerTimeTwo = 0;
dryerInUseTwo = 0;
washerOneBool = false;
washerTwoBool = false;
dryerOneBool = false;
dryerTwoBool = false;


var update = function(json){
	// Use this function to update UI elements instantly/live
	washerTimeOne = json.washerTimeOne;
	washerInUseOne = json.washerInUseOne;
	washerTimeTwo = json.washerTimeTwo;
	washerInUseTwo = json.washerInUseTwo;
	dryerTimeOne = json.dryerTimeOne;
    dryerInUseOne = json.dryerInUseOne;
	dryerTimeTwo = json.dryerTimeTwo;
	dryerInUseTwo = json.dryerInUseTwo;
	addLoads();
}

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		handler.invoke(new Message(deviceURL + "getAllInfo"), Message.JSON);
	},
	onComplete: function(content, message, json){
		update(json);
        addLoads();
     	application.invoke( new Message("/startPolling"));
	}	
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));

Handler.bind("/startPolling", {
    onInvoke: function(handler, message){
		handler.invoke(new Message(deviceURL + "getAllInfo"), Message.JSON);
	},
	onComplete: function(content, message, json){
		update(json);
     	application.invoke( new Message("/delay"));
    }
});

Handler.bind("/delay", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 second
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/startPolling"));
    }
});

//tab template
var buttonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, top:$.top, height:20, name:$.name, skin:$.skin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if ($.textForLabel == "Hamper") {
				if (machinesCon.container) {
					mainContainer.remove(machinesCon);
				} else if (creditsCon.container) {
					mainContainer.remove(creditsCon);
				}
				if (!hamperCon.container) {
					mainContainer.add(hamperCon);
				}
			} else if ($.textForLabel == "Machines") {
				if (hamperCon.container) {
					mainContainer.remove(hamperCon);
				} else if (creditsCon.container) {
					mainContainer.remove(creditsCon);
				}
				if (!machinesCon.container) {
					trace("!!!");
					mainContainer.add(machinesCon);
				}
			
			}else if ($.textForLabel == "Credits") {
				if (hamperCon.container) {
					mainContainer.remove(hamperCon);
				} else if (machinesCon.container) {
					mainContainer.remove(machinesCon);
				}
				if (!creditsCon.container) {
					mainContainer.add(creditsCon);
				}
			}
			
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

//tabs
var hamper = new buttonTemplate({leftPos:0,width:107, bottom:0,  textForLabel: "Hamper", skin: blackSkin});
var machines = new buttonTemplate({leftPos:107, width:107, bottom:0, textForLabel: "Machines", skin: blackSkin});
var credits = new buttonTemplate({leftPos:214, width:108, bottom:0, textForLabel:"Credits", skin: blackSkin});



var containerTemplate = Container.template(function($) { return {
	left: 0, right: 0, top: $.top, bottom: $.bottom, skin: whiteSkin, active: true, contents:$.contents,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			content.focus();
		}}
	})
}});
var content = "";
var titleLabel =  new Label({left:105,top:0, right:0, height: 40, string: "Washr", style: labelStyle});
var scroller = SCROLLER.VerticalScroller.template(function($){ return{
    contents: $.contents
}});
var loadsOne = Line.template(function($){return{
    left:0, right:0, skin:blackSkin, contents:[
     	Label($,{
            left:5, width:7, height: 40, string:$.text1, style:tabStyle,
        }),
        Picture($,{
            left:5, width:100, height:50, url:$.yurl
        }),
        Label($,{
            left:0, right:0, height: 40, string:$.text, style:tabStyle,
        })       
    ]
}});


//containers
var washersCon = new Column({left: 0, right: 0, top:80, skin:blackSkin});
var washer1 = new loadsOne({text1: "1", yurl:"./green.jpeg", text:"Available", name:"W1"});
var washer2 = new loadsOne({text1: "2", yurl:"./green.jpeg", text:"Available", name:"W2"});
washersCon.add(washer1);
washersCon.add(washer2);
var dryersCon = new Column({left: 0, right: 0, top:300, skin:blackSkin});
var dryer1 = new loadsOne({text1: "1", yurl:"./green.jpeg", text:"Available", name:"D1"});
var dryer2 = new loadsOne({text1: "2", yurl:"./green.jpeg", text:"Available", name:"D2"});
dryersCon.add(dryer1);
dryersCon.add(dryer2);
var machinesCon = new containerTemplate({top:0, bottom: 20, 
	contents:[
		new Label({left:0, right:0, top: 30, height: 30, string: "Washers", style: labelStyle, skin: whiteBorderSkin}),
		washersCon,
        new Label({left:0, right:0, top: 250, height: 30, string: "Dryers", style: labelStyle, skin: whiteBorderSkin}),
        dryersCon,
	]});
	

//machinesCon.add(scrollableCon);
//machinesCon.add(ListPane);
//var machinesSubCon = new containerTemplate({bottom: 20});

var hamperCon = new containerTemplate({bottom:20, top:0, 
    contents:[
        titleLabel,
        new Label({left:0, right:0, top: 45, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),
        new scroller({ name: "hamperScroller", top:70, left: 0, right: 0, 
            contents: [
                //new Column({name: "hamperList",left: 0, right: 0, skin:blackSkin}),
            ]
        }),        
]});
var hamperList = new Column({left: 0, right: 0, skin:blackSkin});
var loads = Line.template(function($){return{
    left:0, right:0, skin:blackSkin, contents:[
        Picture($,{
            left:0, right:0,height:50, url:$.yurl
        }),
        Label($,{
            left:0, right:0, height: 40, string:$.text, style:tabStyle,
        }),
        
    ]
}});


var addLoads = function(){
    var washer1 = new loads({yurl:"./orange.jpeg", text:"Washer One"});
    var washer2 = new loads({yurl:"./orange.jpeg", text:"Washer Two"});
    var dryer1 = new loads({yurl:"./orange.jpeg", text:"Dryer One"});
    var dryer2 = new loads({yurl:"./orange.jpeg", text:"Dryer Two"});
    if (washerInUseOne === 1 && washerOneBool === false){
        hamperList.add(washer1);
        washerOneBool = true;
    } else if(washerInUseTwo === 1 && washerTwoBool === false){
        hamperList.add(washer2);
        washerTwoBool = true;
    } else if(dryerInUseOne === 1 && dryerOneBool === false){
        hamperList.add(dryer1);
        dryerOneBool = true;   
    } else if(dryerInUseTwo === 1 && dryerTwoBool === false){
       hamperList.add(dryer1);
       dryerTwoBool = true;
    } else if (washerInUseOne === 0 && washerOneBool === true){
        hamperList.remove(washer1);
        washerOneBool = false;
    } else if (washerInUseTwo === 0 && washerTwoBool === true){
        hamperList.remove(washer2);
        washerTwoBool = false;
    } else if (dryerInUseOne === 0 && dryerOneBool === true){
        hamperList.remove(dryer1);
        dryerOneBool = false; 
    } else if (dryerInUseTwo === 0 && dryerTwoBool === true){
        hamperList.remove(dryer2);
        dryerTwoBool = false; 
    }
}


var creditsCon = new containerTemplate({top:0, bottom:20});

var mainContainer = new containerTemplate({top:0, bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);
mainContainer.add(hamperCon);
//hamperList.add(new loads({yurl:"./orange.jpeg", text:"Washer One"}));
hamperCon.add(hamperList);
application.add(mainContainer);

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("washdevice.app");
	},
	onQuit: function(application) {
		application.forget("washdevice.app");
	},
})

application.behavior = new ApplicationBehavior();
