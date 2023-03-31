const play = document.querySelector(".play"),
  previous = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  //
  trackImage = document.querySelector(".track-image"),
  title = document.querySelector(".title"),
  artist = document.querySelector(".artist"),
  //
  trackCurrentTime = document.querySelector(".current-time"),
  trackDuration = document.querySelector(".duration-time"),
  slider = document.querySelector(".duration-slider"),
  //
  showVolume = document.querySelector("#show-volume"),
  volumeIcon = document.querySelector("#volume-icon"),
  currentVolume = document.querySelector("#volume"),
  //
  autoPlayBtn = document.querySelector(".play-all"),
  //
  hamBurger = document.querySelector(".fa-bars"),
  closeIcon = document.querySelector(".fa-times"),
  //
  musicPlaylist = document.querySelector(".music-playlist"),
  pDiv = document.querySelector(".playlist-div"),
  playlist = document.querySelector(".playList");

let timer;
let autoplay = 0;
let indexTrack = 0;
let songIsPlaying = false;

let track = document.createElement("audio");

// All event Listeners
play.addEventListener("click", justPlay);
next.addEventListener("click", nextSong);
previous.addEventListener("click", prevSong);
autoPlayBtn.addEventListener("click",autoPlayToggle);
volumeIcon.addEventListener("click",muteSound);
volumeIcon.addEventListener("click",muteSound);
currentVolume.addEventListener("change",changeVolume);
slider.addEventListener("change",changeDuration);
track.addEventListener("timeupdate",songTimeUpdate);
hamBurger.addEventListener("click", showPlaylist);
closeIcon.addEventListener("click", hidePlaylist);



// Load Tracks
function loadTrack(indexTrack) {
  clearInterval(timer);
  resetSlider();
  track.src = trackList[indexTrack].path;
  trackImage.src = trackList[indexTrack].img;
  title.innerHTML = trackList[indexTrack].name;
  artist.innerHTML = trackList[indexTrack].singer;
  track.load();

  timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

// Play Song
function playSong() {
  track.play();
  songIsPlaying = true;
  play.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause Song
function pauseSong() {
  track.pause();
  songIsPlaying = false;
  play.innerHTML = '<i class="fas fa-play"></i>';
}

// pLay song or pause song
function justPlay() {
  if (!songIsPlaying) {
    playSong();
  } else {
    pauseSong();
  }
}

//Next Song
function nextSong() {
  if (indexTrack < trackList.length - 1) {
    indexTrack++;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = 0;
    loadTrack(indexTrack);
    playSong();
  }
}

// Previous song
function prevSong() {
  if (indexTrack > 0) {
    indexTrack--;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = trackList.length - 1;
    loadTrack(indexTrack);
    playSong();
  }
}

// Mute Sound
function muteSound(){
  track.volume = 0;
  showVolume.innerHTML = 0;
  currentVolume.value = 0;
}

// Change Volume
function changeVolume(){
  track.volume = currentVolume.value / 100;
  showVolume.innerHTML = currentVolume.value ;
}

// AutoPLAY 
 function autoPlayToggle(){
  if(autoplay == 0){
    autoplay = 1;
    autoPlayBtn.style.backgroundColor="#db6400";
  }
  else{
    autoplay = 0;
    autoPlayBtn.style.backgroundColor="#eee";
  }
 }

// Change Duration
 function changeDuration(){
  let sliderPosition = track.duration * (slider.value / 100);
  track.currentTime = sliderPosition;
 }

 //Reset Slider

 function resetSlider(){
  slider.value=0;
 }

//  Update Slider
function updateSlider(){
  let position = 0;
  if(!isNaN(track.duration)){
    position = track.currentTime * (100 / track.duration);
    slider.value = position;
  }
  if(track.ended){
  play.innerHTML = '<i class="fas fa-play"></i>';
  if(autoplay == 1 && indexTrack < trackList.length -1){
    indexTrack++;
    loadTrack(indexTrack);
    playSong();
  }
  else if(autoplay == 1 && indexTrack == trackList.length -1 ){
    indexTrack = 0;
    loadTrack(indexTrack);
    playSong();
  }

  }
}

// Update Current Song Time

function songTimeUpdate(){
  if(track.duration){
  let curMinutes = Math.floor(track.currentTime/60);
  let curSeconds = Math.floor(track.currentTime - curMinutes * 60);
  let durMins = Math.floor(track.duration/60);
  let durSeconds = Math.floor(track.duration - durMins*60);

  if(durSeconds<10){
    durSeconds="0" + durSeconds;
  }
  if(curSeconds<10){
    curSeconds="0" + curSeconds;
  }
  if(curMinutes<10){
    curMinutes="0" + curMinutes;
  }
  if(durMins<10){
    durMins="0" + durMins;
  }
  trackCurrentTime.innerHTML = `${curMinutes}:${curSeconds}`;
  trackDuration.innerHTML = `${durMins}:${durSeconds}`;
  }
  else {
  trackCurrentTime.innerHTML = `${"00"}:${"00"}`;
  trackDuration.innerHTML = `${"00"}:${"00"}`;

  }
  
}

// Show Playlist
function showPlaylist(){
  musicPlaylist.style.transform = "translateX(0)";
}

//hide playlist
function hidePlaylist(){
  musicPlaylist.style.transform = "translateX(-100%)";
}

// Display Tracks in Playlist

let counter = 1;

function displayTracks(){
  for(let i=0;i<trackList.length;i++){
    const div = document.createElement("div");
    div.classList.add("playList");
    div.innerHTML = 
     `
    <span class="song-index">${counter++}</span>
    <p class="single-song">${trackList[i].name}</p>
    `;
    pDiv.appendChild(div)
  }
  playFromPlaylist();
}
displayTracks();

// Play Song From Playlist

function playFromPlaylist(){
  pDiv.addEventListener("click",(e)=>{
    if(e.target.classList.contains("single-song")){
  const indexNum = trackList.findIndex((item,index) =>{
    if(item.name === e.target.innerHTML){
      return true;
    }
  });
  musicPlaylist.style.transform = "translateX(-100%)";
      loadTrack(indexNum);
      playSong();
    }
  })

}