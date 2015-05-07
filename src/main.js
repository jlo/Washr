// KPR Script file
var THEME = require('themes/sample/theme');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');

//image assets
//var tutorialGif1 = new Texture("nfc-1.gif");
//var tutorialGif2 = new Texture("nfc-2.gif");
//var tutorialGif3 = new Texture("nfc-3.gif");
//var nfcLogo = new Texture("nfc12.gif");
var frame = 1;
var gifContent1 = new Picture({name: "gif", top:5, left:0, right:0, url: "nfc-1.gif"});
//var gifContent2 = new Picture({name: "gif2", left:0, right:0, url: "nfc-2.gif"});
//var gifContent3 = new Picture({name: "gif3", left:0, right:0, url: "nfc-3.gif"});

//skins
var whiteSkin = new Skin( { fill:"white" } );
var greenSkin = new Skin( { fill:"green" } );
var lightBlueSkin = new Skin({ 
	fill:"#14affa", 
});
var lightBlueSkinWithRightBorder = new Skin({ 
	fill:"#14affa", 
//	borders:{bottom:2, right:2}, 
//	stroke:"gray" 
});
var graySkin = new Skin({fill: "gray"});
var cancelSkin = new Skin({fill: "#5c5c5c"});
var purpleSkin = new Skin( { fill:"purple" } );
var redSkin = new Skin( { fill:"#B22222" } );
var liteSkin = new Skin({fill:"01B4F7"});
var blackSkin = new Skin( { fill:"black" } );
var separatorSkin = new Skin({ fill: 'silver',});
var blueSkin = new Skin( { fill:"blue" } );
var whiteBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2}, 
  stroke:"gray"
});
var whiteSkinWithBorders = new Skin({
	fill: "white",
	borders: {bottom:2},
	stroke: "gray"
});
var thinBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2},   
  stroke:"black"
});
var blackTopBorder = new Skin({
	fill: "white",
	borders: {top:2},
	stroke: "gray"
});
var greyTopBorder = new Skin({
	fill: "white",
	borders: {top:2},
	stroke: "silver"
});
var whiteAllBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:2, top:2, right:2, left:2}, 
  stroke:"gray"
});
var greyWithBlackBorders = new Skin({
  fill:"gray", 
  borders:{bottom:2, top:2, right:2, left:2}, 
  stroke:"black"
});
var greyRightBorder = new Skin({
	fill: "white",
	borders: {right: 2},
	stroke: "gray"
});
/*
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
*/
//styles
var labelStyle = new Style( { font: "25px", color:"gray" } );
var whiteTextStyle = new Style({font: "30px", color:"white"});
var topTitleStyle = new Style( { font: "bold 25px", color:"white" } );
var subLabelStyle = new Style( { font: "20px", color:"gray" } );
var subSubLabelStyle = new Style( { font: "17px", color:"gray" } );
var greyStyle = new Style( { font: "18px", color:"#545454" } );
var alertStyle = new Style( { font: "20px", color:"gray" } );
var alertStyleTwo = new Style( { font: "17px", color:"gray" } );
var textLabelStyle = new Style( { font: "bold 15px", color:"gray" } );
var tabStyle = new Style( { font: "bold 15px", color:"white" } );
var bottomTabStyle = new Style( { font: "12px", color:"white" } );
var washerText = new Style( { font: "bold 15px", color:"gray" } );
var creditStyle = new Style( { font: "bold 15px", color:"black" } );
var titleStyle = new Style({font: "bold 30px", color:"black"});
var redStyle = new Style( { font: "bold 20px", color:"red" } );
var previewStyle = new Style( { font: "bold 20px", color:"gray" } );
var hintStyle = new Style({font: "bold 20px", color: "#14affa"});



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
	loadsExist();
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
	left: $.leftPos, width:$.width, bottom:$.bottom, top:$.top, height:$.height, name:$.name, skin:$.skin,
	contents: [
	
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: $.style})
		
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("tapped");
			trace($.textForLabel);
			if ($.textForLabel == "Okay") {
				if (notificationCon.container) {
					application.remove(notificationCon);
					notifConShowing = false;
				} else if (nudgeCon.container) {
					mainContainer.remove(nudgeCon);
				} else if (inUseCon.container) {
					mainContainer.remove(inUseCon);
				}
			} else if ($.textForLabel == "No") {
				mainContainer.remove(preNudgeConfirmCon);
			} else if ($.textForLabel == "Yes") {
				mainContainer.remove(preNudgeConfirmCon);
				mainContainer.add(nudgeCon);
			} else if ($.textForLabel == "Cancel") {
				if (useCon.container) {
					mainContainer.remove(useCon);
				} else if (payCon.container) {
					mainContainer.remove(payCon);
				}
				machineToUse = "";
			} else if ($.textForLabel == "Continue") {
				if (creditSoFar < 2) {
					mainContainer.remove(useCon);
					if (machinesCon.container) {
						mainContainer.remove(machinesCon);
					}	
					if (!creditsCon.container) {
						mainContainer.add(creditsCon);
					}
					credits.delegate("onTap");
				} else {
					mainContainer.remove(useCon);
					mainContainer.add(payCon);
					payCon.behavior = new GifBehavior();
				}
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

		if ($.textForLabel == "Nudge") {
				//trace("in nudge");
				if (!preNudgeConfirmCon.container) {
					mainContainer.add(preNudgeConfirmCon);
				}
			}
			
		}},
	})
}});

var oldPic;
var tabTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, top:$.top, height:$.height, name:$.name, skin:$.skin,
	contents: [
			new Label({left:0, right:0, height:10, bottom:2, string:$.textForLabel, style: $.style}),
	        new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:$.yurl})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			var alerts = false;
			if (!nudgeCon.container && !preNudgeConfirmCon.container && !inUseCon.container && !useCon.container && !notificationCon.container && !payCon.container) {
				alerts = false;
			} else {
				alerts = true;
			}
			
			trace("tapped");
			trace($.textForLabel);
			if (oldPic == null) {
				oldPic = content;
			} else {
				trace("\n" + oldPic.last.url)
				if (oldPic.last.url.indexOf("hamper") > -1 && !alerts) {
					oldPic.remove(oldPic.last);
					oldPic.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"hamper_gray.png"}));
				} else if (oldPic.last.url.indexOf("washer") > -1 && !alerts) {
					oldPic.remove(oldPic.last);
					oldPic.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"washer_gray.png"}));
				} else if (oldPic.last.url.indexOf("credit") > -1 && !alerts) {
					oldPic.remove(oldPic.last);
					oldPic.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"credit_gray.png"}));
				}
				oldPic = content;
			}
			if ($.textForLabel == "Hamper") {
				if (!nudgeCon.container && !preNudgeConfirmCon.container && !inUseCon.container && !useCon.container && !notificationCon.container && !payCon.container) {
					if (machinesCon.container) {
						mainContainer.remove(machinesCon);
					} else if (creditsCon.container) {
						mainContainer.remove(creditsCon);
					}
					if (!hamperCon.container) {
						mainContainer.add(hamperCon);
					}
					content.remove(content.last);
					content.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"hamper_blue.png"}));
				}
			} else if ($.textForLabel == "Machines") {
				if (!nudgeCon.container && !preNudgeConfirmCon.container && !inUseCon.container && !useCon.container && !notificationCon.container && !payCon.container) {
				
					if (hamperCon.container) {
						mainContainer.remove(hamperCon);
					} else if (creditsCon.container) {
						mainContainer.remove(creditsCon);
					}
					if (!machinesCon.container) {
						//trace("!!!");
						mainContainer.add(machinesCon);
					}
					content.remove(content.last);
					content.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"washer_blue.png"}));
				}
			}else if ($.textForLabel == "Credits") {
				if (!nudgeCon.container && !preNudgeConfirmCon.container && !inUseCon.container && !useCon.container && !notificationCon.container && !payCon.container) {
				
					if (hamperCon.container) {
						mainContainer.remove(hamperCon);
					} else if (machinesCon.container) {
						mainContainer.remove(machinesCon);
					}
					if (!creditsCon.container) {
						mainContainer.add(creditsCon);
					}
					content.remove(content.last);
					content.add(new Picture({left:0, right:0, width:$.picWidth, height:$.picHeight, url:"credit_blue.png"}));
				}
			}
		}},
	})
}});



//tabs
var hamper = new tabTemplate({leftPos:0, width:107, height:45, bottom:0, textForLabel: "Hamper", skin:greyTopBorder, style:bottomTabStyle,
			picWidth:40, picHeight:40, yurl:"./hamper_blue.png"});
var machines = new tabTemplate({leftPos:107, width:107, height:45, bottom:0, textForLabel: "Machines", skin:greyTopBorder, style:bottomTabStyle,
			picWidth:40, picHeight:40, yurl:"./washer_gray.png"});
var credits = new tabTemplate({leftPos:214, width:108, height:45, bottom:0, textForLabel:"Credits", skin:greyTopBorder, style:bottomTabStyle,
			picWidth:40, picHeight:40, yurl:"./credit_gray.png"});


var containerTemplate = Container.template(function($) { return {
	left: $.left, right: $.right, top: $.top, bottom: $.bottom, skin: $.skin, active: true, contents:$.contents,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});
var content = "";
//var titleLabel =  new Label({left:105,top:0, right:0, height: 40, string: "Washr", style: labelStyle});


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
    name:$.name,left:0, right:0, height:60, skin:whiteSkinWithBorders, contents:[
     	//Label($,{
          //  left:5, width:7, height: 40, string:$.text1, style:washerText,
       //}),
        Picture($,{
            name: "myPic", left:-20, width:100, height:50, url:$.yurl
        }),
        Label($,{
            name:"myTime", left:0, height: 40, string:$.text, style:washerText,
        }), 
          
    ]
} });

var emptyHamper = Column.template(function($){return{
    left:0, right:0,  contents:[
        //Label($,{
          //  left:5, width:7, height: 40, string:$.text1, style:washerText,
       //}),
        Picture($,{
            height:250, url:"./grey.jpeg"
        }),
        Label($,{
            string:"Your hamper is empty", style:subLabelStyle,
        }), 
          
    ]
} });





//containers

var washersCon = new Column({left: 10, right: 10, top:90, skin:blackSkin});
//RIGHT HERE
var alertTemplate = Container.template(function($) { return {
    left: 20, right: 20, top: 140, bottom: 160, skin: whiteAllBorderSkin, active: true, contents:[
        new Column({top:2, left:2, right:2,height:40, skin:lightBlueSkin, contents:[
            new Label({left:110, top:5, height: 30, string: "Alert", style: topTitleStyle}), 
        ]}),
        new Text({name:$.name, string:$.string, left:25, right:5, top:70, bottom:10, style: alertStyleTwo}),
        new Line({left:0, right:0, top:130, bottom:28, skin: graySkin}),
        new buttonTemplate({leftPos:8, width:265, bottom:5,  textForLabel: "Okay",  style: subSubLabelStyle}),
    
    ]}})
    
var alertYesNoTemplate = Container.template(function($) { return {
    left: 20, right: 20, top: 140, bottom: 160, skin: whiteAllBorderSkin, active: true, contents:[
        new Column({top:2, left:2, right:2,height:40, skin:lightBlueSkin, contents:[
            new Label({left:110, top:5, height: 30, string: "Alert", style: topTitleStyle}), 
        ]}),
        new Text({name:$.name, string:$.string, left:20, right:10, top:70, bottom:10, style: alertStyleTwo}),
        new Line({left:0, right:0, top:130, bottom:28, skin: graySkin}),
        new buttonTemplate({leftPos:142, width:132, bottom:5,  textForLabel: "Yes",  style: subSubLabelStyle}),
    	new buttonTemplate({leftPos:5, width:132, bottom:5, height:20,  textForLabel: "No",  style: subSubLabelStyle, skin: greyRightBorder}),
    	
    ]}})


notificationCon = new alertTemplate({name: "notifText", string: ""});
var preNudgeConfirmCon = new alertYesNoTemplate({name: "preconfirmNudge", string: "          Are you sure you want \n             to nudge this user?"});
var nudgeCon = new alertTemplate({name: "nudgeCon", string: "         You have successfully \n             nudged this user!"});
var inUseCon = new alertTemplate({name: "inUseCon", string: "                      Sorry!\n         This machine is in use!"});

/*var nudgeCon = new containerTemplate({ top:195, bottom:220, left:0, right:0, skin:greyWithBlackBorders,
	contents: [
		new Text({name: "nudgeText", string: "You have successfully nudged this user!", left:0, right:0, top:10, style: alertStyle}),
	]
});*/

var washer_1 = BUTTONS.Button.template(function($){ return{
     left:0, right:0, skin:whiteSkin,
    contents: [
       	new loadsOne({name:$.sname, yurl:$.yurl, text:$.text})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
        	trace("line item tap");
        	var name = "";
        	if ($.sname == "w1") {
					name = "Washer 1";
				} else if ($.sname == "w2") {
					name = "Washer 2";
				} else if ($.sname == "d1") {
					name = "Dryer 1";
				} else {
					name = "Dryer 2";
				}
            if ((name == "Washer 1" && washerInUseOne == 0) || (name == "Washer 2" && washerInUseTwo == 0) || (name == "Dryer 1" && dryerInUseOne == 0) || (name == "Dryer 2" && dryerInUseTwo == 0)) {
				if (!useCon.container) {
					mainContainer.add(useCon);
					subNfcCont.machineUse.string = name;
					if (name.indexOf("Washer") > -1){
						subNfcCont.icon.url = "000washr.png";
					} else {
						subNfcCont.icon.url = "000dryer.png";
					};
					if (creditSoFar < 2) {
						subNfcCont.payPreview.string = "Not Enough Credits";
						useCon.continueToPay.first.string = "Add Credits";
					} else {
						subNfcCont.payPreview.string = "Available Credits: " + creditSoFar;
						useCon.continueToPay.first.string = "Continue";
					}
				}
			} else if ((name == "Washer 1" && washerInUseOne == 1 && washerTimeOne == 0) || (name == "Washer 2" && washerInUseTwo == 1 && washerTimeTwo == 0) || (name == "Dryer 1" && dryerInUseOne == 1 && dryerTimeOne == 0) || (name == "Dryer 2" && dryerInUseTwo == 1 && dryerTimeTwo == 0)) {
				if (!preNudgeConfirmCon.container) {
					mainContainer.add(preNudgeConfirmCon);
				}
			} else if ((name == "Washer 1" && washerInUseOne == 1 && washerTimeOne !=0) || (name == "Washer 2" && washerInUseTwo == 1 && washerTimeTwo != 0) ||  (name == "Dryer 1" && dryerInUseOne == 1 && dryerTimeOne != 0) || (name == "Dryer 2" && dryerInUseTwo == 1 && dryerTimeTwo == 0)) {
				if (!inUseCon.container) {
					mainContainer.add(inUseCon);
				}
			}
            
        } },
    })
}});
var washer1 = new washer_1({sname:"w1", yurl:"00washr.png", text:"Available"});
var washer2 = new washer_1({sname: "w2", yurl:"00washr.png", text:"Available"});

var dryer1 = new washer_1({ sname: "d1", yurl:"00dryer.png", text:"Available"});
var dryer2 = new washer_1({ sname: "d2", yurl:"00dryer.png", text:"Available"});

var nudge_w1 = new pictureButtonTemplate({leftPos:260, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",skin: whiteSkin, style: tabStyle});
var nudge_w2 = new pictureButtonTemplate({leftPos:260, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",skin: whiteSkin, style: tabStyle});
var nudge_d1 = new pictureButtonTemplate({leftPos:260, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png",skin: whiteSkin, style: tabStyle});
var nudge_d2 = new pictureButtonTemplate({leftPos:260, width:30, top:10, bottom:10, textForLabel:"Nudge", url: "nudge.png", skin: whiteSkin, style: tabStyle});
nudge_w1.visible = false;
nudge_w2.visible = false;
nudge_d1.visible = false;
nudge_d2.visible = false;

washer1.add(nudge_w1);
washer2.add(nudge_w2);
dryer1.add(nudge_d1);
dryer2.add(nudge_d2);
washersCon.add(washer1);
washersCon.add(washer2);

var dryersCon = new Column({left: 10, right: 10, top:260, skin:blackSkin});
dryersCon.add(dryer1);
dryersCon.add(dryer2);


var machinesCon = new containerTemplate({top:0, bottom: 45, left:0, right:0,skin: liteSkin,
	contents:[
	    new Column({top:0, left:0, right:0,height:40, skin:lightBlueSkin, contents:[
            new Label({left:110, top:5, height: 30, string: "Machines", style: topTitleStyle}), 
        ]}),
		new Label({left:10, right:10, top: 60, height: 30, string: "Washers", style: labelStyle, skin: whiteBorderSkin}),
		washersCon,
        new Label({left:10, right:10, top: 230, height: 30, string: "Dryers", style: labelStyle, skin: whiteBorderSkin}),
        dryersCon,
	]});



var hamperList = new Column({left: 10, right: 10, top:90, height:200, skin:whiteSkin});

var hamperCon = new containerTemplate({bottom:45, top:0, left:0, right:0, skin: whiteSkin,
    contents:[
        new Column({top:0, left:0, right:0,height:40, skin:lightBlueSkin, contents:[
            new Picture({right:0, left:0, top:5, height:30, url: "./washr_allwhite.png"}),   
        ]}),
        new Label({left:10, right:10, top: 60, height: 30, string: "My Hamper", style: labelStyle, skin: whiteBorderSkin}),
        
]});

//User is going to use a machine
var subNfcCont = new containerTemplate({top: 0, bottom: 50, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
		new Text({string: "Use", left: 30, right:0, top: 35, style: labelStyle}),
		new Text({name: "machineUse", string: "Machine", left:30, right:0, top: 65, style: alertStyle}),
		new Text({name: "useText", string: "Cost: $2.00", left:30, right:0, top:95, style: alertStyle}),
		new Picture({name: "icon", width: 70, height:100, top: 20, left:160, right:0, url: "000washr.png"}),
		new Text({name: "payPreview", top:160, left:75, right:0, string: "Available Credits:\n" + creditSoFar, style: previewStyle}),
	]
});


	var GifBehavior = function(gif){
		this.gif = gif;
	}
	
	GifBehavior.prototype = Object.create(Object.prototype, {
		onDisplaying: {
			value: function(gifCont) {
				gifCont.start();
				trace("begin");
			}
		},
		onTimeChanged: {
			value: function(gifCont) {
			/*	
				if (frame > 3) {
					//payCon.gifCont.remove(gifContent1);
					payCon.gifCont.add(gifContent2);
				}
				if (frame > 6) {
					//payCon.gifCont.remove(gifContent2);
					payCon.gifCont.add(gifContent3);
				}
				if (frame > 9) {
					frame = -1;
					//payCon.gifCont.remove(gifContent3);
					payCon.gifCont.add(gifContent1);
				}
				frame++;
			*/
			}
		}
	})
	
	
var gifCont = new containerTemplate({top: 0, bottom: 50, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
		gifContent1, 
		new Text({name: "hint", string: "Tap Against Device To Pay", left:50, right:20, top: 190, style: hintStyle}),
			],
	behavior: new GifBehavior(gifContent1)
});

var payCon = new containerTemplate({ top:70, bottom: 120, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
	    gifCont,
		new buttonTemplate({leftPos:105, width:108, bottom:15, textForLabel: "Cancel", skin: cancelSkin, style: tabStyle}),
	],
});

var useCon = new containerTemplate({ top:70, bottom: 120, left:0, right:0, skin:whiteAllBorderSkin,
	contents: [
	    subNfcCont,
	    new buttonTemplate({name: "continueToPay", leftPos:160, width:108, bottom:15, textForLabel: "Continue", skin: lightBlueSkin, style: tabStyle}),
		new buttonTemplate({leftPos:45, width:108, bottom:15, textForLabel: "Cancel", skin: cancelSkin, style: tabStyle}),
	]
});



// Credits Resources
var bigText = new Style({font:"bold 55px", color:"#333333"});

// Button for adding a card 
var addCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:lightBlueSkinWithRightBorder,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			//mainContainer.remove(creditsCon);
			creditsCon.add(addCardCon);
		} },
	})
}});

// Button for returning to credits screen
var cancelAddCardButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos,right:$.right, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:cancelSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle}),
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			creditsCon.remove(addCardCon);
			//mainContainer.add(creditsCon);
		} },
	})
}});

// Button for adding a card 
var addCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:lightBlueSkinWithRightBorder,
    contents: [
        new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
            trace("Button was tapped.\n");
            //mainContainer.remove(creditsCon);
            creditsCon.add(addCreditsCon);
        } },
    })
}});

// Button for returning to credits screen
var cancelAddCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: $.leftPos, right:$.right, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:cancelSkin,
    contents: [
        new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
            trace("Button was tapped.\n");
            creditsCon.remove(addCreditsCon);
            //mainContainer.add(creditsCon);
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
    left: $.leftPos, width:$.width, bottom:$.bottom, height:25, name:$.name, skin:lightBlueSkinWithRightBorder,
    contents: [
        new Label({left:0, right:0, height:30, string:$.textForLabel, style: tabStyle})
        ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
                buttonCredits = parseInt($.textForLabel.substring(1));
                trace(buttonCredits);
                var temp = creditSoFar + buttonCredits;
                addCreditsCon.creditsCol1.creditsCol2.creditsLine2.right.string = "$"+temp;
        }},
        
    })
}});
var confirmCreditsButtonTemplate = BUTTONS.Button.template(function($){ return{
    top:30,left: $.leftPos, right:$.right,width:$.width, bottom:$.bottom, height:30, name:$.name, skin:lightBlueSkinWithRightBorder,
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
            creditsCon.remove(addCreditsCon);
            //mainContainer.add(creditsCon);
            addCreditsCon.creditsCol1.creditsCol2.creditsLine1.lefty.string = "$"+creditSoFar;
            addCreditsCon.creditsCol1.creditsCol2.creditsLine2.right.string = "$0";
            subNfcCont.payPreview.string = "Available Credits: " + creditSoFar;
            //otherField.moreScroller.more.string = "";
        }},
        
    })
}});




var addCreditsCon = new containerTemplate({left:0, right:0, top:0, bottom:45, skin: whiteSkin,
    contents:[
        new Column({top:0, left:0, right:0,height:40, skin:lightBlueSkin, contents:[
            new Label({left:100, top:5, height: 30, string: "Add Credits", style: topTitleStyle}), 
        ]}),
        new Column({name:"creditsCol1",top:60,left:5, right:5, skin:whiteSkin, contents:[
            new Line({top:10, left:20, right:20, skin:whiteAllBorderSkin, contents: [
                new Label({left:20,right:20, height:40, string: "Default Payment                 Visa *1234", style: textLabelStyle}),
                ]
            }),
            new Line({top:30,horizontal:"center", contents: [
                new creditsButtonTemplate({leftPos:0, width:50, bottom:10, textForLabel:"$1"}),
                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$5"}),
                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$10"}),
                new creditsButtonTemplate({leftPos:10, width:50, bottom:10, textForLabel:"$20"}),
                ]
            }),
            
            new Column({name:"creditsCol2", top:30, left:0, right:0, contents: [
                new Line({name:"creditsLine1",left:0, contents:[
                    new Label({top:0, left:40, height:40, string: "Current Balance", style: labelStyle}),
                    new Label({name:"lefty",left:40, top:0, height:40, string: "$0", style: labelStyle}),]}),
                
                new Line({name:"creditsLine2", left:0, contents:[
                    new Label({ top:0, left:40, height:40, string: "New Balance", style: labelStyle}),
                    new Label({name:"right",left:70, top:0,  height:40, string: "$0", style: labelStyle}),]}),
                ]
            }),
            new confirmCreditsButtonTemplate({leftPos:100,right:100, width:100, bottom:10, textForLabel:"Confirm"}),
            new cancelAddCreditsButtonTemplate({leftPos:100,right:100, width:100, bottom:10, textForLabel:"Cancel"}),
        ]
        }),
    ]
})

var creditsCon = new containerTemplate({top:0, bottom:45, left:0, right:0, skin: whiteSkin,
	contents:[
		new Column({top:0, left:0, right:0,height:40, skin:lightBlueSkin, contents:[
            new Label({left:120, top:5, height: 30, string: "Credits", style: topTitleStyle}), 
        ]}),
		new Label({left:10, right:10, top: 50, height: 30, string: "Available Credits", style: subLabelStyle, skin: whiteBorderSkin}),
		new Line({name:"omg",left:10, right:0, top:75, height:35,
			contents: [
				new Label({name:"wtf",left:10, top:10, right:0, height: 30, string: "Credits: $" + creditSoFar, style: subSubLabelStyle}),
				new addCreditsButtonTemplate({leftPos:0, right:10, width:30, bottom:0, name:"add money", textForLabel:"+ Add Credits"}),
			]
		}),
		new Label({left:10, right:10, top: 150, height:30, string: "Payment Methods", style: subLabelStyle, skin: whiteBorderSkin}),
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
	left: $.leftPos, width:$.width, bottom:$.bottom, height:30, name:$.name, skin:lightBlueSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			trace("Button was tapped.\n");
			trace(field_num.first.first.string + "\n");
			creditsCon.cards.cardscol.add(new Label({left:0, right:0, height:30, string: " •••• •••• •••• " + field_num.first.first.string.substring(12,16), style: 
Text, skin: whiteBorderSkin}));
			field_name.first.first.string = ""
			field_num.first.first.string = ""
			field_deets.first.first.string = ""
			creditsCon.remove(addCardCon);
			//mainContainer.add(creditsCon);
		} },
	})
}});

var field_name = new myField({ name: "" });
var field_num = new myField({ name: "" });
var field_deets = new myField_deets({ name: "" });
var addCardCon = new containerTemplate({top:0, bottom:45, left:0, right:0,  skin: whiteSkin,
	contents:[
        new Column({top:0, left:0, right:0,height:40, skin:lightBlueSkin, contents:[
            new Label({left:100, top:5, height: 30, string: "Add Payment", style: topTitleStyle}), 
        ]}),
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

var hamperBool = false;

var loadsExist = function(){

    if(washerInUseOne === 0 && washerOneBool === false && washerInUseTwo === 0 && washerTwoBool === false &&dryerInUseOne === 0 && dryerOneBool === false &&dryerInUseTwo === 0 && dryerTwoBool === false){
        if(hamperBool === false){
            hamperButton123 = new emptyHamper({});
            hamperList.add(hamperButton123);
            hamperBool = true;
        }
    }else{
        if(hamperBool === true){
            hamperList.remove(hamperButton123);
            hamperBool = false;
        }
    }
}


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
        washer1.w1.myTime.string = "Available";
        washerTimeOne = 0;
    } else{
        washer1.w1.myTime.string =  washerTimeOne + " mins left";
    }
    if(washerInUseTwo === 0){
        washer2.w2.myTime.string = "Available";
        washerTimeTwo = 0;
    } else {
        washer2.w2.myTime.string = washerTimeTwo + " mins left";
    }
    if(dryerInUseOne === 0){
        dryer1.d1.myTime.string = "Available";
        dryerTimeOne = 0;
    } else{
        dryer1.d1.myTime.string = dryerTimeOne + " mins left";
    }
    if(dryerInUseTwo === 0){
        dryer2.d2.myTime.string = "Available";
        dryerTimeTwo = 0;
    } else {
        dryer2.d2.myTime.string = dryerTimeTwo + " mins left";
    }
    hwasher1.myTime.string = washer1.first.myTime.string;
    hwasher2.myTime.string = washer2.first.myTime.string;
    hdryer1.myTime.string = dryer1.first.myTime.string;
    hdryer2.myTime.string = dryer2.first.myTime.string;
}
var picChange = function(){
	var str_w1 = washer1.first.myPic.url.toString();
	str_w1 = str_w1.substring(str_w1.length - 11, str_w1.length);
    var str_w2 = washer2.first.myPic.url.toString();
	str_w2 = str_w2.substring(str_w2.length - 11, str_w2.length);
    var str_d1 = dryer1.first.myPic.url.toString();
    str_d1 = str_d1.substring(str_d1.length - 11, str_d1.length);
    var str_d2 = dryer2.first.myPic.url.toString();
  	str_d2 = str_d2.substring(str_d2.length - 11, str_d2.length);
    	
    if(washerInUseOne === 0){
    	//trace(url_w1);
    	if ( str_w1 != "00washr.png") {
    		//trace("hereeeee");
        	washer1.w1.myPic.url = "00washr.png";
        }
        	//use_w1.first.next.opacity = 1;
        	nudge_w1.visible = false;
        	
    } else if(washerTimeOne<=11.25 && washerInUseOne === 1){
    	if (str_w1 != "14washr.png") {
    		//trace("whyyy");
    		//trace(url_w1);
	        washer1.w1.myPic.url = "14washr.png";
	        hwasher1.myPic.url = "14washr.png";
        }
        if (washerTimeOne == 0) {
    
	        	//use_w1.first.next.opacity = 0.2;
	        	nudge_w1.visible = true;
	    } else {
	    	//use_w1.first.next.opacity = 0.2;
	        	nudge_w1.visible = false;
	    }
	} else if (washerTimeOne > 11.25 && washerTimeOne <= 22.5 && washerInUseOne == 1) {
	
		if (str_w1 != "24washr.png") {
    	
	        washer1.w1.myPic.url = "24washr.png";
	        hwasher1.myPic.url = "24washr.png";
	        
	    }
	    nudge_w1.visible = false;
	} else if (washerTimeOne > 22.5 && washerTimeOne <= 33.75 && washerInUseOne == 1) {
		if (str_w1 != "34washr.png") {
    	
	        washer1.w1.myPic.url = "34washr.png";
	        hwasher1.myPic.url = "34washr.png";
	    }
	    nudge_w1.visible = false;
    } else if(washerTimeOne>33.75 && washerInUseOne === 1){
    	if (str_w1 != "44washr.png") {
    	
	        washer1.w1.myPic.url = "44washr.png";
	        hwasher1.myPic.url = "44washr.png";
	    }
	    //use_w1.first.next.opacity = 0.2;
	    nudge_w1.visible = false;
    }
    if(washerInUseTwo === 0){
    	
    	if (str_w2 != "00washr.png") {
	    	washer2.w2.myPic.url = "00washr.png";
	        hwasher2.myPic.url = "00washr.png";
	    }
        
        	//use_w2.first.next.opacity = 1;
        	nudge_w2.visible = false;
        
    } else if(washerTimeTwo<=11.25 && washerInUseTwo === 1){
    	if (str_w2 != "14washr.png") {
	        washer2.w2.myPic.url = "14washr.png";
	        hwasher2.myPic.url = "14washr.png";
	    }
	    if (washerTimeTwo == 0) {
        	//use_w2.first.next.opacity = 0.2;
	        nudge_w2.visible = true;
	    } else {
	    	//use_w2.first.next.opacity = 0.2;
	        nudge_w2.visible = false;
	    }
	} else if (washerTimeTwo > 11.25 && washerTimeTwo <= 22.5 && washerInUseTwo == 1) {
	
		if (str_w2 != "24washr.png") {
    	
	        washer2.w2.myPic.url = "24washr.png";
	        hwasher2.myPic.url = "24washr.png";
	    }
	     nudge_w2.visible = false;
	} else if (washerTimeTwo > 22.5 && washerTimeTwo <= 33.75 && washerInUseTwo == 1) {
		if (str_w2 != "34washr.png") {
    	
	        washer2.w2.myPic.url = "34washr.png";
	        hwasher2.myPic.url = "34washr.png";
	    }
	     nudge_w2.visible = false;

    } else {
    	if (str_w2 != "44washr.png") {
    	
	        washer2.w2.myPic.url = "44washr.png";
	        hwasher2.myPic.url = "44washr.png";
	    }
    	//use_w2.first.next.opacity = 0.2;
	    nudge_w2.visible = false;
        
        
    }
    if(dryerInUseOne === 0){
    	
    	if (str_d1 != "00dryer.png") {
        	dryer1.d1.myPic.url = "00dryer.png";
        	hdryer1.myPic.url = "00dryer.png";
        }
        //use_d1.first.next.opacity = 1;
       nudge_d1.visible = false;
        
    } else if(dryerTimeOne<=15 && dryerInUseOne === 1){
    	if (str_d1 != "14dryer.png") {
    	
	        dryer1.d1.myPic.url = "14dryer.png";
	        hdryer1.myPic.url = "14dryer.png";
	    }
        
        if (dryerTimeOne == 0) {
	         nudge_d1.visible = true;
	     } else {
	     	//use_d1.first.next.opacity = 0.2;
	         nudge_d1.visible = false;
	     }
	} else if (dryerTimeOne > 15 && dryerTimeOne <= 30 && dryerInUseOne == 1) {
		if (str_d1 != "24dryer.png") {
    	
	        dryer1.d1.myPic.url = "24dryer.png";
	        hdryer1.myPic.url = "24dryer.png";
	    }
	     nudge_d1.visible = false;
	} else if (dryerTimeOne > 30 && dryerTimeOne <= 45 && dryerInUseOne == 1) {
		if (str_d1 != "34dryer.png") {
    	
	        dryer1.d1.myPic.url = "34dryer.png";
	        hdryer1.myPic.url = "34dryer.png";
	    }
	     nudge_d1.visible = false;
    } else {
    	
    	if (str_d1 != "44dryer.png") {
	        dryer1.d1.myPic.url = "44dryer.png";
	        hdryer1.myPic.url = "44dryer.png";
	    }
	     nudge_d1.visible = false;
        
    }
    if(dryerInUseTwo === 0){
    	
    	if (str_d2 != "00dryer.png") {
        	dryer2.d2.myPic.url = "00dryer.png";
        	hdryer2.myPic.url = "00dryer.png";
        	
        }
          nudge_d2.visible = false;
       
    } else if(dryerTimeTwo<=15 && dryerInUseTwo === 1){
    	if (str_d2 != "14dryer.png"){
        	dryer2.d2.myPic.url = "14dryer.png";
        	hdryer2.myPic.url = "14dryer.png";
       	}
        if (dryerTimeTwo == 0) {
	    	//use_d2.first.next.opacity = 0.2;
	    	 nudge_d2.visible = true;
	    } else {
	    	 nudge_d2.visible = false;
	    }
	} else if (dryerTimeTwo >15 && dryerTimeTwo < 30 && dryerInUseTwo == 1) {
		if (str_d2 != "24dryer.png") {
    	
	        dryer2.d2.myPic.url = "24dryer.png";
	        hdryer2.myPic.url = "24dryer.png";
	    }
	     nudge_d2.visible = false;
	} else if (dryerTimeTwo > 30 && dryerTimeTwo <= 45 && dryerInUseTwo == 1) {
		if (str_d2 != "34dryer.png") {
	        dryer2.d2.myPic.url = "34dryer.png";
	        hdryer2.myPic.url = "34dryer.png";
	    }
	     nudge_d2.visible = false;
    } else {
    	if (str_d2 != "44dryer.png") {
	        dryer2.d2.myPic.url = "44dryer.png";
	        hdryer2.myPic.url = "44dryer.png";
	    }
         nudge_d2.visible = false;
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
hamper.delegate("onTap");

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("washdevice.app");
	},
	onQuit: function(application) {
		application.forget("washdevice.app");
	},
})

application.behavior = new ApplicationBehavior();
