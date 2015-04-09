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
	left: $.leftPos, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:blackSkin,
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
var hamper = new buttonTemplate({leftPos:0,width:107, bottom:0,  textForLabel: "Hamper"});
var machines = new buttonTemplate({leftPos:107, width:107, bottom:0, textForLabel: "Machines"});
var credits = new buttonTemplate({leftPos:214, width:108, bottom:0, textForLabel:"Credits"});

var containerTemplate = Container.template(function($) { return {
	left: 0, right: 0, top: 0, bottom: $.bottom, skin: whiteSkin, active: true, contents:$.contents,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});
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
        	]}) 
    ]
})


//containers
var machinesCon = new containerTemplate({bottom: 20});
machinesCon.add(scrollableCon);
//machinesCon.add(ListPane);
var hamperCon = new containerTemplate({bottom:20,
    contents:[
        titleLabel,
        new Label({left:0, right:0, top: 45, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),
        new scroller({ name: "hamperScroller", top:70, left: 0, right: 0, 
            contents: [
                //new Column({name: "hamperList",left: 0, right: 0, skin:blackSkin}),
            ]
        }),        
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

var creditsCon = new containerTemplate({bottom:20,
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
var addCardCon = new containerTemplate({bottom:20,
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

var mainContainer = new containerTemplate({bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);

mainContainer.add(creditsCon);
// mainContainer.add(hamperCon);
hamperList.add(new loads({yurl:"./orange.jpeg", text:"Washer One"}));
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
