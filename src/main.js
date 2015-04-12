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
var labelStyle = new Style( { font: "bold 30px", color:"black"});
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
	timeChange();
	picChange();
}

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		handler.invoke(new Message(deviceURL + "getAllInfo"), Message.JSON);
	},
	onComplete: function(content, message, json){
		update(json);
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
            name: "myPic", left:5, width:100, height:50, url:$.yurl
        }),
        Label($,{
            name:"myTime", left:0, right:0, height: 40, string:$.text, style:tabStyle,
        })       
    ]
}});


//containers
var washersCon = new Column({left: 0, right: 0, top:80, skin:blackSkin});
var washer1 = new loadsOne({text1: "1", yurl:"./green.jpeg", text:"Available"});
var washer2 = new loadsOne({text1: "2", yurl:"./green.jpeg", text:"Available"});
washersCon.add(washer1);
washersCon.add(washer2);
var dryersCon = new Column({left: 0, right: 0, top:300, skin:blackSkin});
var dryer1 = new loadsOne({text1: "1", yurl:"./green.jpeg", text:"Available"});
var dryer2 = new loadsOne({text1: "2", yurl:"./green.jpeg", text:"Available"});
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

var hamperList = new Column({left: 0, right: 0, skin:blackSkin});
var hamperCon = new containerTemplate({bottom:20, top:0, 
    contents:[
        titleLabel,
        new Label({left:0, right:0, top: 55, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),
        hamperList
      
]});
/*
var loads = Line.template(function($){return{
    left:0, right:0, skin:blackSkin, contents:[
        Picture($,{
            name:"myPic", left:0, width:100, height:50, url:$.yurl
        }),
        Label($,{
            width: 100, height: 40, string:$.text, style:tabStyle,
        }),
        Label($,{
             name:"myTime", width:100, height: 40, string:"Time" + $.time, style:tabStyle,
        }),
        
    ]
}});

var washer1 = new loads({yurl:"./orange.jpeg", text:"Washer One", time:washerTimeOne});
var washer2 = new loads({yurl:"./orange.jpeg", text:"Washer Two", time:washerTimeTwo});
var dryer1 = new loads({yurl:"./orange.jpeg", text:"Dryer One", time:dryerTimeOne});
var dryer2 = new loads({yurl:"./orange.jpeg", text:"Dryer Two", time:dryerTimeTwo});
*/
var hwasher1 = new loadsOne({text1: "1", yurl:"./red.jpeg", text:washerTimeOne});
var hwasher2 = new loadsOne({text1: "2", yurl:"./red.jpeg", text:washerTimeOne});
var hdryer1 = new loadsOne({text1: "1", yurl:"./red.jpeg", text:washerTimeOne});
var hdryer2 = new loadsOne({text1: "2", yurl:"./red.jpeg", text:washerTimeOne});
var addLoads = function(){
    if (washerInUseOne === 1 && washerOneBool === false){
        hamperList.add(hwasher1);
        washerOneBool = true;
    }
    if(washerInUseTwo === 1 && washerTwoBool === false){
        hamperList.add(hwasher2);
        washerTwoBool = true;
    }
    if(dryerInUseOne === 1 && dryerOneBool === false){
        hamperList.add(hdryer1);
        dryerOneBool = true;   
    }
    if(dryerInUseTwo === 1 && dryerTwoBool === false){
       hamperList.add(hdryer1);
       dryerTwoBool = true;
    }
    if (washerInUseOne === 0 && washerOneBool === true){
        hamperList.remove(hwasher1);
        washerOneBool = false;
    }
    if (washerInUseTwo === 0 && washerTwoBool === true){
        hamperList.remove(hwasher2);
        washerTwoBool = false;
    }
    if (dryerInUseOne === 0 && dryerOneBool === true){
        hamperList.remove(hdryer1);
        dryerOneBool = false; 
    } 
    if (dryerInUseTwo === 0 && dryerTwoBool === true){
        hamperList.remove(hdryer2);
        dryerTwoBool = false; 
    }
}
var timeChange = function(){
    if(washerInUseOne === 0){
        washer1.myTime.string = "Available";
    } else{
        washer1.myTime.string = washerTimeOne;
    }
    if(washerInUseTwo === 0){
        washer2.myTime.string = "Available";
    } else {
        washer2.myTime.string = washerTimeTwo;
    }
    if(dryerInUseOne === 0){
        dryer1.myTime.string = "Available";
    } else{
        dryer1.myTime.string = dryerTimeOne;
    }
    if(dryerInUseTwo === 0){
        dryer2.myTime.string = "Available";
    } else {
        dryer2.myTime.string = dryerTimeTwo;
    }
    hwasher1.myTime.string = washerTimeOne;
    hwasher2.myTime.string = washerTimeTwo;
    hdryer1.myTime.string = dryerTimeOne;
    hdryer2.myTime.string = dryerTimeTwo;
}
var picChange = function(){
    if(washerInUseOne === 0){
        washer1.myPic.url = "./green.jpeg";
    } else if(washerTimeOne<=15 && washerInUseOne === 1){
        washer1.myPic.url = "./yellow.jpeg";
        hwasher1.myPic.url = "./yellow.jpeg";
    } else if(washerTimeOne>15 && washerInUseOne === 1){
        washer1.myPic.url = "./red.jpeg";
        hwasher1.myPic.url = "./red.jpeg";
    }
    if(washerInUseTwo === 0){
        washer2.myPic.url = "./green.jpeg";
    } else if(washerTimeTwo<=15 && washerInUseTwo === 1){
        washer2.myPic.url = "./yellow.jpeg";
        hwasher2.myPic.url = "./yellow.jpeg";
    } else {
        washer2.myPic.url = "./red.jpeg";
        hwasher2.myPic.url = "./red.jpeg";
    }
    if(dryerInUseOne === 0){
        dryer1.myPic.url = "./green.jpeg";
    } else if(dryerTimeOne<=15 && dryerInUseOne === 1){
        dryer1.myPic.url = "./yellow.jpeg";
        hdryer1.myPic.url = "./yellow.jpeg";
    } else {
        dryer1.myPic.url = "./red.jpeg";
        hdryer1.myPic.url = "./red.jpeg";
    }
    if(dryerInUseTwo === 0){
        dryer2.myPic.url = "./green.jpeg";
    } else if(dryerTimeTwo<=15 && dryerInUseTwo === 1){
        dryer2.myPic.url = "./yellow.jpeg";
        hdryer2.myPic.url = "./yellow.jpeg";
    } else {
        dryer2.myPic.url = "./red.jpeg";
        hdryer2.myPic.url = "./red.jpeg";
    }
}
var creditsCon = new containerTemplate({top:0, bottom:20});

var mainContainer = new containerTemplate({top:0, bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);

mainContainer.add(hamperCon);
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
