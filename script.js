const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const volumeControl = document.getElementById('volume');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const playlist = document.getElementById('playlist');

let audio = new Audio();
let currentTrackIndex = 0;
let isShuffling = false;
let isRepeating = false;
let tracks = Array.from(playlist.querySelectorAll('li')).map(li => li.dataset.src);

function loadTrack(index) {
    audio.src = tracks[index];
    audio.play();
}

playButton.addEventListener('click', () => audio.play());
pauseButton.addEventListener('click', () => audio.pause());
prevButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
});
nextButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
});
volumeControl.addEventListener('input', (e) => audio.volume = e.target.value);
shuffleButton.addEventListener('click', () => isShuffling = !isShuffling);
repeatButton.addEventListener('click', () => isRepeating = !isRepeating);

audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.play();
    } else if (isShuffling) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
        loadTrack(currentTrackIndex);
    } else {
        nextButton.click();
    }
});

playlist.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        currentTrackIndex = tracks.indexOf(e.target.dataset.src);
        loadTrack(currentTrackIndex);
    }
});

loadTrack(currentTrackIndex);
