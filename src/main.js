// KPR Script file
var THEME = require('themes/sample/theme');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');

//skins
var whiteSkin = new Skin( { fill:"white" } );
var redSkin = new Skin( { fill:"red" } );
var blackSkin = new Skin( { fill:"black" } );
var separatorSkin = new Skin({ fill: 'silver',});
var blueSkin = new Skin( { fill:"blue" } );
var labelStyle = new Style( { font: "bold 30px", color:"black" } );
var subLabelStyle = new Style( { font: "bold 20px", color:"black" } );
var subSubLabelStyle = new Style( { font: "18px", color:"black" } );
var textLabelStyle = new Style( { font: "15px", color:"black" } );
var whiteBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:5}, 
  stroke:"black"
});
var thinBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2}, 
  stroke:"black"
});

//styles
var tabStyle = new Style( { font: "bold 15px", color:"white" } );
var creditStyle = new Style( { font: "bold 15px", color:"black" } );
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

notifConShowing = false;

var update = function(json){
	// Use this function to update UI elements instantly/live
	showNotification(json);
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
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});
var content = "";
var titleLabel =  new Label({left:105,top:0, right:0, height: 40, string: "Washr", style: labelStyle});
var scroller = SCROLLER.VerticalScroller.template(function($){ return{
    contents: $.contents
}});

var scrollableCon = new scroller({ name: "comicScroller", left: 0, right: 0, 
    contents: [
        new Column({name: "comic", top: 0, left: 0, right: 0, skin:blackSkin,
        	contents: [
        		new Label({left:0, right:0, string: "Washer 1", style:tabStyle}),
        		new Label({left:0, right:0, string: "Dryer 1", style:tabStyle}),
   			]
   		})
   ]
}) 

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
} });


//containers
var notificationCon = new containerTemplate({bottom:50, top:50,
    contents:[
		new Content({left:20, right:20, top:20, bottom:20, skin:whiteAllBorderSkin}),
]});
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
        new Label({left:0, right:0, top: 45, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),
        new scroller({top:70, left: 0, right: 0, contents:[ 
            hamperList
            ]
        })
]});

// Credits Resources
var bigText = new Style({font:"bold 55px", color:"#333333"});

// Button for adding a card 
var addCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:whiteSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: creditStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			mainContainer.remove(creditsCon);
			mainContainer.add(addCardCon);
		} },
		onComplete: { value: function(content, message, json){
		} }
	})
}});

// Button for returning to credits screen
var cancelAddCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:whiteSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: creditStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			mainContainer.remove(addCardCon);
			mainContainer.add(creditsCon);
		} },
		onComplete: { value: function(content, message, json){
		} }
	})
}});

//var button = new buttonTemplate({left:10, right:10, top:10, textForLabel:"Click Me!"});

var creditsCon = new containerTemplate({top:0, bottom:20,
	contents:[
		new Label({left:110,top:0, right:0, height: 40, string: "Credits", style: labelStyle}),
		new Label({left:10, right:0, top: 45, height: 30, string: " Available Credits", style: subLabelStyle, skin: whiteBorderSkin}),
		new Line({left:10, right:0, top:75, height:35,
			contents: [
				new Label({left:10, top:10, right:0, height: 30, string: "Credits: 10", style: subSubLabelStyle}),
			]
		}),
		new Label({left:10, right:0, top: 150, height:30, string: " Payment Methods", style: subLabelStyle, skin: whiteBorderSkin}),
		new Line({name: "cards", left:0, right:0, top: 180, height:50, 
			contents: [
				// new scroller({ name: "comicScroller", left: 0, right: 0, 
            	//	contents: [
               	new Column({name: "cardscol", top:20, left: 0, right: 0, skin:whiteSkin,
                    contents: [
                    	// new Line({left:0, right:0, skin:whiteSkin, 
                    	// 	contents:[
                        //     	new cardButtonTemplate({leftPos:0, width:200, bottom:20, name:"card 1", textForLabel:" VISA **** **** **** 1234"}),
                        //     ]
                        // }),
                       	new Line({left:0, right:0, skin:whiteSkin, 
                    		contents:[
                            	new addCardButtonTemplate({leftPos:0, width:200, bottom:20, name:"add card", textForLabel:"+ Add Credit Card"}),
                           	]
                       	}),
						// new Label({left:10, right:0, height:30, string: " VISA **** **** **** 1234", style: textLabelStyle, skin: thinBorderSkin}),
                 	]
             	}),
            ]
        }),

	]
})

// Fields
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: '15px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: '10px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var whiteS = new Skin({fill:"white"});
var noBorderSkin = new Skin({
  fill:"white",  
  stroke:"black"
});
					
var myField = Container.template(function($) { return { 
	width: 200, height: 30, right: 10, skin: nameInputSkin, contents: [
		Scroller($, { 
			left: 4, right: 4, top: 4, bottom: 4, active: true, 
			behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
				Label($, { 
					left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
					editable: true, string: $.name,
				 	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
				 		onEdited: { value: function(label){
				 			var data = this.data;
							data.name = label.string;
							label.container.hint.visible = ( data.name.length == 0 );	
				 		}}
				 	}),
				 }),
				 Label($, {
	 			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"", name:"hint"
				 })
			]
		})
	]
}});

var myField_deets = Container.template(function($) { return { 
	width: 200, height: 30, right: 10, skin: nameInputSkin, contents: [
		Scroller($, { 
			left: 4, right: 4, top: 4, bottom: 4, active: true, 
			behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
				Label($, { 
					left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
					editable: true, string: $.name,
				 	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
				 		onEdited: { value: function(label){
				 			var data = this.data;
							data.name = label.string;
							label.container.hint.visible = ( data.name.length == 0 );	
				 		}}
				 	}),
				 }),
				 Label($, {
	 			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"MM/YY CCV ZIP", name:"hint"
				 })
			]
		})
	]
}});

// Button for saving add card page
var saveCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:redSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: creditStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			// creditsCon.first.next.next.next.first.first.add(new Label({left:10, right:0, height:30, string: " VISA **** **** **** 1234", style: textLabelStyle, skin: thinBorderSkin}));
			trace(field_num.first.first.string + "\n");
			creditsCon.cards.cardscol.add(new Label({left:10, right:0, height:30, string: " **** **** **** " + field_num.first.first.string.substring(12,16), style: textLabelStyle, skin: thinBorderSkin}));
			field_name.first.first.string = ""
			field_num.first.first.string = ""
			field_deets.first.first.string = ""
			mainContainer.remove(addCardCon);
			mainContainer.add(creditsCon);
		} },
		onComplete: { value: function(content, message, json){
		} }
	})
}});
// var saveCardButton = 

var field_name = new myField({ name: "" });
var field_num = new myField({ name: "" });
var field_deets = new myField_deets({ name: "" });
// Add Credit Card Page
var addCardCon = new containerTemplate({top:0, bottom:20,
	contents:[
		new Line({top:0, left:0, right:0, skin:whiteSkin, contents: [
			new cancelAddCardButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"cancel"}),
			new Label({left:30, top:0, right:0, height:40, string: "Add a Card", style: labelStyle}),
			]
		}),
		new Column({name: "cardinfo", top:40, left: 0, right: 0, skin:blackSkin,
          	contents: [
            	new Line({left:0, right:0, skin:whiteSkin, contents:[
                  		new Label({left:10, right:0, height:50, string: " Name: ", style: textLabelStyle, skin: noBorderSkin}),
                  		field_name,
                  	]
               	}),
               	new Line({left:0, right:0, skin:whiteSkin, contents:[
                  		new Label({left:10, right:0, height:50, string: " Card Number: ", style: textLabelStyle, skin: noBorderSkin}),
                  		field_num,
                  	]
               	}),
               	new Line({left:0, right:0, skin:whiteSkin, contents:[
                  		new Label({left:10, right:0, height:50, string: " Card Details: ", style: textLabelStyle, skin: noBorderSkin}),
                  		field_deets,
                  	]
               	}),
               	new Line({left:0, right:0, skin:whiteSkin, contents:[
                  		new saveCardButtonTemplate({leftPos:100, width:100, bottom:10, textForLabel:"Save"}),
                  	]
               	}),
          	] 
     	}),
	]
})

var hamperList = new Column({left: 0, right: 0, skin:blackSkin});

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


// Brings up the dialog box for letting users know was is complete
// Wash is complete when a washer/dryer goes from 1 (in use) to 0 (not in use)
var showNotification = function(json){
	// Use this function to update UI elements instantly/live
	if (washerInUseOne == 1 && json.washerInUseOne == 0) {
		if (!notifConShowing) {
			application.add(notificationCon)
			notifConShowing = true;
		}
	} else if (washerInUseTwo == 1 && json.washerInUseTwo == 0) {
	
	} else if (dryerInUseOne == 1 && json.dryerInUseOne == 0) {
	
	} else if (dryerInUseTwo == 1 && json.dryerInUseTwo == 0) {
	
	}
}

var mainContainer = new containerTemplate({top:0, bottom:0});

mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);

// mainContainer.add(creditsCon);
mainContainer.add(hamperCon);
// hamperList.add(new loads({yurl:"./orange.jpeg", text:"Washer One"}));
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
