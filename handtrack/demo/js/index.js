const video = document.getElementById("myvideo");
const myVideo = document.getElementById("myVid");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let nextImageButton = document.getElementById("nextimagebutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;




// video.width = 500
// video.height = 400

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



nextImageButton.addEventListener("click", function(){
    nextImage();
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});

function nextImage() {

    imgindex++;
    handimg.src = "images/" + imgindex % 15 + ".jpg"
    // alert(handimg.src)
    runDetectionImage(handimg)
}

Object.size = function(obj) {
    var size = 0, key;
	
	//console.log(JSON.stringify(obj));
	//jsonObj=JSON.parse(obj)
	for (i=0;i< obj.length;i++) {
		//console.log("Inside iterating object"+i)
		 //console.log(obj[i]);
		 var myArr = JSON.parse(JSON.stringify(obj[i]));
		 console.log(myArr.bbox[0])
		 //console.log(myArr.bbox[3])
		//jsonObj=JSON.parse(obj[i])
		//console.log(jsonObj.class)
		//console.log(obj[i][1])
		if(myArr.bbox[0] < 250)
		{
			//url = "http://www.systutorials.com";
			//window.open(url);
			//var myVideo = document.getElementById("myVid");
			//myVideo.play();
			myVideo.play();
			
        } 
		if(myArr.bbox[0] > 250)
		{
			myVideo.pause();
		}	
	}
	//console.log("the object is")
	//console.log(obj[0])
    for (key in obj) {
		console.log("Key is"+key)
		console.log(key)
        if (obj.hasOwnProperty(key)) size++;
    }
	bbObject =obj.bbbox
	
	//for(j=0;j< bbObject.length;j++)
	//{
		//console.log(bbObject[j]);
	//}	
    return size;
};





function Minimize()
{
window.innerWidth = 100;
window.innerHeight = 100;
window.screenX = screen.width;
window.screenY = screen.height;
alwaysLowered = true;
}

function Maximize()
{
window.innerWidth = screen.width;
window.innerHeight = screen.height;
window.screenX = 0;
window.screenY = 0;
alwaysLowered = false;
}





function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictionsadsfsafasdfsa: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
		console.log(typeof predictions);
		// Get the size of an object
		var size = Object.size(predictions);
		console.log(size)
		if(size == 3){
		   console.log("Close")
		   //window.close()	
		}
		if(size == 2){
		   console.log("Minimize")
		   //window.close()
		   //window.moveTo(0, 0);
		}
		
		if(size == 0){
		   console.log("Maximize")
		}
				
    });
}

function runDetectionImage(img) {
    model.detect(img).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, img);
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    runDetectionImage(handimg)
    trackButton.disabled = false
    nextImageButton.disabled = false
});
