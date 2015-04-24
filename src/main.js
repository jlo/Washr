// KPR Script file
var THEME = require('themes/sample/theme');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');

//image assets
var tutorialGif1 = new Texture("nfc-1.gif");
var tutorialGif2 = new Texture("nfc-2.gif");
var tutorialGif3 = new Texture("nfc-3.gif");
var nfcLogo = new Texture("nfc12.gif");

//skins
var whiteSkin = new Skin( { fill:"white" } );
var greenSkin = new Skin( { fill:"green" } );
var lightBlueSkin = new Skin( { fill:"#1E90FF" } );
var purpleSkin = new Skin( { fill:"purple" } );
var redSkin = new Skin( { fill:"#B22222" } );
var liteSkin = new Skin({fill:"01B4F7"});
var blackSkin = new Skin( { fill:"black" } );
var separatorSkin = new Skin({ fill: 'silver',});
var blueSkin = new Skin( { fill:"blue" } );
var whiteBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:5}, 
  stroke:"black"
});
var whiteSkinWithBorders = new Skin({
	fill: "white",
	borders: {bottom:2},
	stroke: "black"
});
var thinBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2},   
  stroke:"black"
});
var blackTopBorder = new Skin({
	fill: "white",
	borders: {top:2},
	stroke: "black"
});
var whiteAllBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2, top:2, right:2, left:2}, 
  stroke:"black"
});
var greyWithBlackBorders = new Skin({
  fill:"gray", 
  borders:{bottom:2, top:2, right:2, left:2}, 
  stroke:"black"
});
var nfcSkin = new Skin ({
	width: 80, height: 60, 
	texture: nfcLogo, fill: "red"
});
var tutorialSkin1 = new Skin ({
	width: 288, height: 180, 
	texture: tutorialGif1, fill: "white"
});
var tutorialSkin2 = new Skin ({
	width: 288, height: 180, 
	texture: tutorialGif2, fill: "white"
});
var tutorialSkin3 = new Skin ({
	width: 288, height: 180, 
	texture: tutorialGif3, fill: "white"
});

//styles
var labelStyle = new Style( { font: "bold 30px", color:"black" } );
var subLabelStyle = new Style( { font: "bold 20px", color:"black" } );
var subSubLabelStyle = new Style( { font: "18px", color:"black" } );
var alertStyle = new Style( { font: "20px", color:"black" } );
var alertStyleTwo = new Style( { font: "17px", color:"black" } );
var textLabelStyle = new Style( { font: "15px", color:"black" } );
var tabStyle = new Style( { font: "bold 15px", color:"white" } );
var washerText = new Style( { font: "bold 15px", color:"black" } );
var creditStyle = new Style( { font: "bold 15px", color:"black" } );
var titleStyle = new Style({font: "bold 30px", color:"black"});
var redStyle = new Style( { font: "bold 20px", color:"red" } );


var use_w1;
var use_w2;
var use_d1;
var use_d2;
var notificationCon;
var creditSoFar = 0;
var buttonCredits = 0;

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
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: $.style})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("tapped");
			trace($.textForLabel);
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
					//trace("!!!");
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
			} else if ($.textForLabel == "Okay") {
				application.remove(notificationCon);
				notifConShowing = false;
			
			} else if ($.textForLabel == "Cancel") {
				if (useCon.container) {
					mainContainer.remove(useCon);
				} else if (payCon.container) {
					mainContainer.remove(payCon);
				}
				machineToUse = "";
			} else if ($.textForLabel == "Tap to Continue") {
				mainContainer.remove(useCon);
				mainContainer.add(payCon);
			} 
			
		}},
	})
}});

var pictureButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, top:$.top, height:20, name:$.name, skin:$.skin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: $.style}),
		new Picture({left:0, right:0, width: 60, url: $.url, opacity: $.opacity})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if ($.textForLabel == "Use" && $.opacity == 1) {
				if (creditSoFar < 2) {
					subNfcCont.payPreview.string = "Not Enough Credits";
					subNfcCont.payPreview.style = redStyle;
				} else {
					subNfcCont.payPreview.string = "Available Credits: " + creditSoFar;
					subNfcCont.payPreview.style = subLabelStyle;
				}
				mainContainer.add(useCon);
				subNfcCont.machineUse.string = $.name;
			} else if ($.textForLabel == "Nudge" && $.opacity == 1) {
				//trace("in nudge");
				if (!nudgeCon.container) {
					mainContainer.add(nudgeCon);
				}
			}
			
		}},
	})
}});



//tabs
var hamper = new buttonTemplate({leftPos:0,width:107, bottom:0,  textForLabel: "Hamper", skin: blackSkin, style: tabStyle});
var machines = new buttonTemplate({leftPos:107, width:107, bottom:0, textForLabel: "Machines", skin: blackSkin, style:tabStyle});
var credits = new buttonTemplate({leftPos:214, width:108, bottom:0, textForLabel:"Credits", skin: blackSkin, style: tabStyle});


var containerTemplate = Container.template(function($) { return {
	left: $.left, right: $.right, top: $.top, bottom: $.bottom, skin: $.skin, active: true, contents:$.contents,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			if (nudgeCon.container) {
				mainContainer.remove(nudgeCon);
			}
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});
var content = "";
//var titleLabel =  new Label({left:105,top:0, right:0, height: 40, string: "Washr", style: labelStyle});
var titleLabel = new Picture({right:0, left:0, top:30, height:70, url: "./logo.jpeg"})

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
    left:0, right:0, height:60, skin:whiteSkinWithBorders, contents:[
     	//Label($,{
          //  left:5, width:7, height: 40, string:$.text1, style:washerText,
       //}),
        Picture($,{
            name: "myPic", left:-20, width:100, height:50, url:$.yurl
        }),
        Label($,{
            name:"myTime", left:0, width:140, height: 40, string:$.text, style:washerText,
        }), 
          
    ]
} });


//containers

var washersCon = new Column({left: 0, right: 0, top:60, skin:blackSkin});
//var notifText = new Text({name: "notifText", string: "", left:20, right:20, top:80, bottom:30, style: alertStyle});
notificationCon = new containerTemplate({bottom:160, top:140, left: 20, right: 20,  skin:whiteAllBorderSkin,
    contents:[
    	new Label({string: "Alert", left:110, top: 10, skin:whiteSkin, style: labelStyle}),
    	//new buttonTemplate({leftPos:0, width:320, top:10,  textForLabel: "Alert", skin: thinBorderSkin, style: labelStyle}),
		new Text({name: "notifText", string: "", left:25, right:5, top:70, bottom:10, style: alertStyleTwo}),
		new buttonTemplate({leftPos:8, width:265, bottom:5,  textForLabel: "Okay", skin: blackTopBorder, style: subSubLabelStyle}),
		
]});

var nudgeCon = new containerTemplate({ top:195, bottom:220, left:0, right:0, skin:greyWithBlackBorders,
	contents: [
		new Text({name: "nudgeText", string: "You have successfully nudged this user!", left:0, right:0, top:10, style: alertStyle}),
	]
});
var washer1 = new loadsOne({ yurl:"./green.jpeg", text:"Available"});
var washer2 = new loadsOne({ yurl:"./green.jpeg", text:"Available"});


use_w1 = new pictureButtonTemplate({name: "Washer 1", leftPos:25, width:30, top:10, bottom:10, textForLabel:"Use", url: "use.png", opacity: 1,skin: whiteSkin, style: tabStyle});
use_w2 = new pictureButtonTemplate({name: "Washer 2", leftPos:25, width:30, top:10, bottom:10, textForLabel:"Use", url: "use.png",opacity: 1, skin: whiteSkin, style: tabStyle});
use_d1 = new pictureButtonTemplate({name: "Dryer 1", leftPos:25, width:30, top:10, bottom:10, textForLabel:"Use", url: "use.png",opacity: 1, skin: whiteSkin, style: tabStyle});
use_d2 = new pictureButtonTemplate({name: "Dryer 2", leftPos:25, width:30, top:10, bottom:10, textForLabel:"Use", url: "use.png",opacity: 1, skin: whiteSkin, style: tabStyle});

var nudge_w1 = new pictureButtonTemplate({leftPos:5, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",opacity: 0.5,skin: whiteSkin, style: tabStyle});
var nudge_w2 = new pictureButtonTemplate({leftPos:5, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",opacity: 0.5,skin: whiteSkin, style: tabStyle});
var nudge_d1 = new pictureButtonTemplate({leftPos:5, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",opacity: 0.5,skin: whiteSkin, style: tabStyle});
var nudge_d2 = new pictureButtonTemplate({leftPos:5, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png", opacity: 0.5,skin: whiteSkin, style: tabStyle});
nudge_w1.first.next.opacity = 0.2;
nudge_w2.first.next.opacity = 0.2;
nudge_d1.first.next.opacity = 0.2;
nudge_d2.first.next.opacity = 0.2;
washer1.add(use_w1);
washer1.add(nudge_w1);
washer2.add(use_w2);
washer2.add(nudge_w2);


washersCon.add(washer1);
washersCon.add(washer2);
var dryersCon = new Column({left: 0, right: 0, top:270, skin:blackSkin});
var dryer1 = new loadsOne({ yurl:"./green.jpeg", text:"Available"});
var dryer2 = new loadsOne({ yurl:"./green.jpeg", text:"Available"});
dryer1.add(use_d1);
dryer1.add(nudge_d1);
dryer2.add(use_d2);
dryer2.add(nudge_d2);
dryersCon.add(dryer1);
dryersCon.add(dryer2);

var machinesCon = new containerTemplate({top:0, bottom: 20, left: 0, right:0, skin: liteSkin,
	contents:[
		new Label({left:0, right:0, top: 30, height: 30, string: "Washers", style: labelStyle, skin: whiteBorderSkin}),
		washersCon,
        new Label({left:0, right:0, top: 240, height: 30, string: "Dryers", style: labelStyle, skin: whiteBorderSkin}),
        dryersCon,
	]});

var hamperList = new Column({left: 0, right: 0, top:150, height:200, skin:whiteSkin});
var hamperCon = new containerTemplate({bottom:20, top:0, left:0, right:0, skin: whiteSkin,
    contents:[
        titleLabel,
        new Label({left:0, right:0, top: 120, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),

]});

//User is going to use a machine
var subNfcCont = new containerTemplate({top: 0, bottom: 50, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
		new Text({string: "Use", left: 30, right:0, top: 55, style: labelStyle}),
		new Text({name: "machineUse", string: "Machine", left:30, right:0, top: 90, style: alertStyle}),
		new Text({name: "useText", string: "Cost: $2.00", left:30, right:0, top:120, style: alertStyle}),
		new Content({top: 60, left:160, right:0, skin: nfcSkin}),
		new buttonTemplate({leftPos:184, width:108, top:120, textForLabel: "Tap to Continue", skin: whiteSkin, style: textLabelStyle}),
		new Text({name: "payPreview", top:160, left:70, right:0, string: creditSoFar, style: subLabelStyle}),
	]
});

var gifCont = new containerTemplate({top: 0, bottom: 50, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
		new Content({name: "gif", left:0, right:0, skin: tutorialSkin1}),
			]
});

var payCon = new containerTemplate({ top:80, bottom: 120, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
	    gifCont,
		new buttonTemplate({leftPos:110, width:108, bottom:15, textForLabel: "Cancel", skin: redSkin, style: tabStyle}),
	]
});

var useCon = new containerTemplate({ top:80, bottom: 120, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
	    subNfcCont,
		new buttonTemplate({leftPos:110, width:108, bottom:15, textForLabel: "Cancel", skin: redSkin, style: tabStyle}),
	]
});



// Credits Resources
var bigText = new Style({font:"bold 55px", color:"#333333"});

// Button for adding a card 
var addCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:lightBlueSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			mainContainer.remove(creditsCon);
			mainContainer.add(addCardCon);
		} },
	})
}});

// Button for returning to credits screen
var cancelAddCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos,right:$.right, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:redSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			mainContainer.remove(addCardCon);
			mainContainer.add(creditsCon);
		} },
	})
}});

// Button for adding a card 
var addCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:lightBlueSkin,
    contents: [
        new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
            trace("Button was tapped.\n");
            mainContainer.remove(creditsCon);
            mainContainer.add(addCreditsCon);
        } },
    })
}});

// Button for returning to credits screen
var cancelAddCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:redSkin,
    contents: [
        new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
            trace("Button was tapped.\n");
            mainContainer.remove(addCreditsCon);
            mainContainer.add(creditsCon);
        } },
    })
}});
var otherField = Container.template(function($) { return { 
    width: 60, height: 25, top:0,left: 10, skin:blackSkin, contents: [
        Scroller($, { 
            name:"moreScroller",left: 4, right: 4, top: 4, bottom: 4, active: true, 
            behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
                Label($, { 
                    name:"more",left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: creditStyle, anchor: 'NAME', 
                    editable: true, string: $.name,
                    behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
                        onEdited: { value: function(label){
                            var data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = ( data.name.length == 0 );
                            buttonCredits = parseInt(label.string);
                            //addCreditsCon.creditsCol.creditsLine.righty.string = creditSoFar+buttonCredits;   
                        }}
                    }),
                 }),
                 Label($, {
                     style:tabStyle, string:"Other", name:"hint"
                 })
            ]
        })
    ]
}});
var creditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: $.leftPos, width:$.width, bottom:$.bottom, height:25, name:$.name, skin:blackSkin,
    contents: [
        new Label({left:0, right:0, height:30, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
                buttonCredits = parseInt($.textForLabel.substring(1));
                trace(buttonCredits);
                var temp = creditSoFar + buttonCredits;
                addCreditsCon.creditsCol.creditsLine.right.string = "$"+temp;
        }},
        
    })
}});
var confirmCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    top:30,left: $.leftPos, right:$.right,width:$.width, bottom:$.bottom, height:30, name:$.name, skin:greenSkin,
    contents: [
        new Label({left:10, right:10, height:20, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
            if(buttonCredits === NaN){
                creditsSoFar = 0;
            } else{
                creditSoFar = creditSoFar + buttonCredits;
            }
            
            creditsCon.omg.wtf.string = "Credits: $" + creditSoFar;
            mainContainer.remove(addCreditsCon);
            mainContainer.add(creditsCon);
            addCreditsCon.creditsCol.creditsLine.lefty.string = "$"+creditSoFar;
            addCreditsCon.creditsCol.creditsLine.right.string = "$0";
            //otherField.moreScroller.more.string = "";
        }},
        
    })
}});




var addCreditsCon = new containerTemplate({left:0, right:0, top:10, bottom:20, skin: whiteSkin,
    contents:[
        new Label({left:90, right:0, top:0, height:40, string: "Add Credits", style: labelStyle}),
        new Column({name:"creditsCol",top:60,left:5, right:5, skin:whiteSkin, contents:[
            new Line({top:5, contents: [

                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$5"}),
                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$10"}),
                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$20"}),
                //new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"Other"}),
                new otherField({name:""}),
                ]
            }),
            new Line({top:30, left:20, right:20, skin:whiteAllBorderSkin, contents: [
                new Label({left:20,right:20, height:40, string: "Default Payment                 Visa *1234", style: textLabelStyle}),
                ]
            }),
            new Line({name:"creditsLine",top:30, left:0, right:0, contents: [
                new Label({name:"lefty",left:30, top:0, right:0, height:40, string: "$0", style: labelStyle}),
                new Label({left:30, top:0, right:0, height:40, string: ">>", style: labelStyle}),
                new Label({name:"right",left:30, top:0, right:0, height:40, string: "$0", style: labelStyle}),
                ]
            }),
            new confirmCreditsButtonTemplate({leftPos:100,right:100, width:100, bottom:10, textForLabel:"Confirm"}),
            new cancelAddCreditsButtonTemplate({leftPos:100,right:100, width:100, bottom:10, textForLabel:"Cancel"}),
        ]
        }),
    ]
})

var creditsCon = new containerTemplate({top:0, bottom:20, left:0, right:0, skin: whiteSkin,
	contents:[
		new Label({left:110,top:10, right:0, height: 40, string: "Credits", style: labelStyle}),
		new Label({left:10, right:0, top: 50, height: 30, string: " Available Credits", style: subLabelStyle, skin: whiteBorderSkin}),
		new Line({name:"omg",left:10, right:0, top:75, height:35,
			contents: [
				new Label({name:"wtf",left:10, top:10, right:0, height: 30, string: "Credits: $" + creditSoFar, style: subSubLabelStyle}),
				new addCreditsButtonTemplate({leftPos:0, right:10, width:30, bottom:0, name:"add money", textForLabel:"+ Add Credits"}),
			]
		}),
		new Label({left:10, right:0, top: 150, height:30, string: "Payment Methods", style: subLabelStyle, skin: whiteBorderSkin}),
		new Line({name: "cards", left:0, right:0, top: 180, height:50, 
			contents: [
               	new Column({name: "cardscol", top:20, left: 0, right: 0, skin:whiteSkin,
                    contents: [
                       	new Line({left:0, right:0, skin:whiteSkin, 
                    		contents:[
                            	new addCardButtonTemplate({leftPos:60, width:200, bottom:20, name:"add card", textForLabel:"+ Add Credit Card"}),
                           	]
                       	}),
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
	left: $.leftPos, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:greenSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			trace(field_num.first.first.string + "\n");
			creditsCon.cards.cardscol.add(new Label({left:10, right:0, height:30, string: " **** **** **** " + field_num.first.first.string.substring(12,16), style: textLabelStyle, skin: thinBorderSkin}));
			field_name.first.first.string = ""
			field_num.first.first.string = ""
			field_deets.first.first.string = ""
			mainContainer.remove(addCardCon);
			mainContainer.add(creditsCon);
		} },
	})
}});

var field_name = new myField({ name: "" });
var field_num = new myField({ name: "" });
var field_deets = new myField_deets({ name: "" });
var addCardCon = new containerTemplate({top:0, bottom:20, left:0, right:0,  skin: whiteSkin,
	contents:[
		new Line({top:0, left:0, right:0, skin:whiteSkin, contents: [
			
			new Label({left:90, top:10, right:0, height:40, string: "Add a Card", style: labelStyle}),
			]
		}),
		new Column({name: "cardinfo", top:70, left: 0, right: 0, skin:whiteSkin,
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
                new saveCardButtonTemplate({leftPos:110, width:100, bottom:10, textForLabel:"Save"}),
                new cancelAddCardButtonTemplate({leftPos:110, width:100, bottom:10, textForLabel:"Cancel"}),
                
          	] 
     	}),
	]
})

	
var hwasher1 = new loadsOne({yurl:"./red.jpeg", text:washerTimeOne});
var hwasher2 = new loadsOne({yurl:"./red.jpeg", text:washerTimeOne});
var hdryer1 = new loadsOne({yurl:"./red.jpeg", text:washerTimeOne});
var hdryer2 = new loadsOne({yurl:"./red.jpeg", text:washerTimeOne});

var addLoads = function(){
    if (washerInUseOne === 1 && washerOneBool === false){
        	hamperList.add(hwasher1);
        washerOneBool = true;
        if (payCon.container) {
        	mainContainer.remove(payCon);
        };
        creditSoFar = creditSoFar - 2;
    }
    if(washerInUseTwo === 1 && washerTwoBool === false){
        hamperList.add(hwasher2);
        washerTwoBool = true;
        if (payCon.container) {
        	mainContainer.remove(payCon);
        };
        creditSoFar = creditSoFar - 2;
    }
    if(dryerInUseOne === 1 && dryerOneBool === false){
        hamperList.add(hdryer1);
        dryerOneBool = true;   
        if (payCon.container) {
        	mainContainer.remove(payCon);
        };
        creditSoFar = creditSoFar - 2;
    }
    if(dryerInUseTwo === 1 && dryerTwoBool === false){
       hamperList.add(hdryer2);
       dryerTwoBool = true;
       if (payCon.container) {
        	mainContainer.remove(payCon);
        };
        creditSoFar = creditSoFar - 2;
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
        washerTimeOne = 0;
    } else{
        washer1.myTime.string = "Time Left: " + washerTimeOne;
    }
    if(washerInUseTwo === 0){
        washer2.myTime.string = "Available";
        washerTimeTwo = 0;
    } else {
        washer2.myTime.string = "Time Left: " + washerTimeTwo;
    }
    if(dryerInUseOne === 0){
        dryer1.myTime.string = "Available";
        dryerTimeOne = 0;
    } else{
        dryer1.myTime.string = "Time Left: " +dryerTimeOne;
    }
    if(dryerInUseTwo === 0){
        dryer2.myTime.string = "Available";
        dryerTimeTwo = 0;
    } else {
        dryer2.myTime.string = "Time Left: " + dryerTimeTwo;
    }
    hwasher1.myTime.string = washer1.myTime.string;
    hwasher2.myTime.string = washer2.myTime.string;
    hdryer1.myTime.string = dryer1.myTime.string;
    hdryer2.myTime.string = dryer2.myTime.string;
}
var picChange = function(){
	var str_w1 = washer1.myPic.url.toString();
    var url_w1 = str_w1.substring(56, str_w1.length);
    var str_w2 = washer2.myPic.url.toString();
    var url_w2 = str_w2.substring(56, str_w2.length);
    var str_d1 = dryer1.myPic.url.toString();
    var url_d1 = str_d1.substring(56, str_d1.length);
    var str_d2 = dryer2.myPic.url.toString();
    var url_d2 = str_d2.substring(56, str_d2.length);
    	
    if(washerInUseOne === 0){
    	
    	//trace(url_w1);
    	if ( url_w1 != "/green.jpeg") {
    		//trace("hereeeee");
        	washer1.myPic.url = "./green.jpeg";
        	
        }
   
     
        	use_w1.first.next.opacity = 1;
        	nudge_w1.first.next.opacity = 0.2;
        	
       
        
    } else if(washerTimeOne<=15 && washerInUseOne === 1){
    	if (url_w1 != "/yellow.jpeg") {
    		//trace("whyyy");
    		//trace(url_w1);
	        washer1.myPic.url = "./yellow.jpeg";
	        hwasher1.myPic.url = "./yellow.jpeg";
        }
        if (washerTimeOne == 0) {
    
	        	use_w1.first.next.opacity = 0.2;
	        	nudge_w1.first.next.opacity = 1;
	    } else {
	    	use_w1.first.next.opacity = 0.2;
	        	nudge_w1.first.next.opacity = 0.2;
	    }
	     

	    
    } else if(washerTimeOne>15 && washerInUseOne === 1){
    
        if (url_w1 != "/red.jpeg") {
	        washer1.myPic.url = "./red.jpeg";
	        hwasher1.myPic.url = "./red.jpeg";
	        
	    }
	    use_w1.first.next.opacity = 0.2;
	    nudge_w1.first.next.opacity = 0.2;
    }
    if(washerInUseTwo === 0){
    	
    	if (url_w2 != "/green.jpeg") {
	    	washer2.myPic.url = "./green.jpeg";
	        washer2.myPic.url = "./green.jpeg";
	    }
        
        	use_w2.first.next.opacity = 1;
        	nudge_w2.first.next.opacity = 0.2;
        
    } else if(washerTimeTwo<=15 && washerInUseTwo === 1){
    	if (url_w2 != "/yellow.jpeg") {
	        washer2.myPic.url = "./yellow.jpeg";
	        hwasher2.myPic.url = "./yellow.jpeg";
	    }
	    if (washerTimeTwo == 0) {
        	use_w2.first.next.opacity = 0.2;
	        nudge_w2.first.next.opacity = 1;
	    } else {
	    	use_w2.first.next.opacity = 0.2;
	        nudge_w2.first.next.opacity = 0.2;
	    }
    } else {
    	if (url_w2 != "/red.jpeg") {
    		washer2.myPic.url = "./red.jpeg";
        	hwasher2.myPic.url = "./red.jpeg";
    	}
    	use_w2.first.next.opacity = 0.2;
	    nudge_w2.first.next.opacity = 0.2;
        
        
    }
    if(dryerInUseOne === 0){
    	
    	if (url_d1 != "/green.jpeg") {
        	dryer1.myPic.url = "./green.jpeg";
        }
        use_d1.first.next.opacity = 1;
        nudge_d1.first.next.opacity = 0.2;
        
    } else if(dryerTimeOne<=15 && dryerInUseOne === 1){
    	if (url_d1 != "/yellow.jpeg") {
    	
	        dryer1.myPic.url = "./yellow.jpeg";
	        hdryer1.myPic.url = "./yellow.jpeg";
	    }
        
        if (dryerTimeOne == 0) {
	        use_d1.first.next.opacity = 0.2;
	        nudge_d1.first.next.opacity = 1;
	     } else {
	     	use_d1.first.next.opacity = 0.2;
	        nudge_d1.first.next.opacity = 0.2;
	     }
    } else {
    	
    	if (url_d1 != "/red.jpeg") {
	        dryer1.myPic.url = "./red.jpeg";
	        hdryer1.myPic.url = "./red.jpeg";
	    }
	    use_d1.first.next.opacity = 0.2;
	    nudge_d1.first.next.opacity = 0.2;
        
    }
    if(dryerInUseTwo === 0){
    	
    	if (url_d2 != "/green.jpeg") {
        	dryer2.myPic.url = "./green.jpeg";
        }
         use_d2.first.next.opacity = 1;
        nudge_d2.first.next.opacity = 0.2;
       
    } else if(dryerTimeTwo<=15 && dryerInUseTwo === 1){
    	if (url_d2 != "/yellow.jpeg"){
        	dryer2.myPic.url = "./yellow.jpeg";
        	hdryer2.myPic.url = "./yellow.jpeg";
       	}
        if (dryerTimeTwo == 0) {
	    	use_d2.first.next.opacity = 0.2;
	    	nudge_d2.first.next.opacity = 1;
	    } else {
	    	use_d2.first.next.opacity = 0.2;
	    	nudge_d2.first.next.opacity = 0.2;
	    }
    } else {
    	if (url_d2 != "/red.jpeg") {
	        dryer2.myPic.url = "./red.jpeg";
	        hdryer2.myPic.url = "./red.jpeg";
	    }
        use_d2.first.next.opacity = 0.2;
	    	nudge_d2.first.next.opacity = 0.2;
    }
}


// Brings up the dialog box for letting users know was is complete
// Wash is complete when a washer/dryer goes from 1 (in use) to 0 (not in use)
var showNotification = function(json){
	// Use this function to update UI elements instantly/live
	if (washerInUseOne == 1 && json.washerInUseOne == 0) {
		trace(notifConShowing);
		if (!notifConShowing) {
			trace("washer1");
			application.add(notificationCon);
			notificationCon.notifText.string = "Your load in Washer 1 is complete!";
			
			notifConShowing = true;
			
		}
	} else if (washerInUseTwo == 1 && json.washerInUseTwo == 0) {
		if (!notifConShowing) {
			trace("2");
			application.add(notificationCon);
			notificationCon.notifText.string = "Your load in Washer 2 is complete!";
			
			notifConShowing = true;
		}
	} else if (dryerInUseOne == 1 && json.dryerInUseOne == 0) {
		if (!notifConShowing) {
			trace("d1");
			application.add(notificationCon);
			notificationCon.notifText.string = "Your load in Dryer 1 is complete!";
			notifConShowing = true;
		}
	} else if (dryerInUseTwo == 1 && json.dryerInUseTwo == 0) {
		if (!notifConShowing) {
			trace("d2");
			application.add(notificationCon);
			notificationCon.notifText.string = "Your load in Dryer 2 is complete!";
			
			
			notifConShowing = true;
		}
	} 
}

var mainContainer = new containerTemplate({top:0, bottom:0, right:0, left:0, skin:whiteSkin});

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
