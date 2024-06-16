// Fetch API key from server
fetch('/api/key')
  .then(response => response.json())
  .then(data => {
    const API_KEY = data.apiKey;
    console.log("Your API key is:", API_KEY);

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const videoList = document.getElementById("video-list");
    const playPauseButton = document.getElementById("play-pause");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const volumeSlider = document.getElementById("volume-slider");
    const shuffleButton = document.getElementById("shuffle");
    const repeatButton = document.getElementById("repeat");

    let player;
    let currentVideoId = "";
    let isPlaying = false;
    let isShuffling = false;
    let isRepeating = false;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    function onYouTubeIframeAPIReady() {
      console.log("YouTube IFrame API Ready");
      player = new YT.Player("player", {
        height: "180",
        width: "500",
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerReady(event) {
      console.log("Player Ready");
      playPauseButton.disabled = false;
      player.setVolume(volumeSlider.value);
    }

    function onPlayerStateChange(event) {
      console.log("Player State Change:", event.data);
      if (event.data == YT.PlayerState.ENDED) {
        if (isRepeating) {
          player.playVideo();
        } else if (isShuffling) {
          playRandomVideo();
        } else {
          playNextVideo();
        }
      }
    }

    searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      const query = searchInput.value;
      searchYouTube(query);
    });

    function searchYouTube(query) {
      console.log("Searching YouTube for:", query);
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${query}&key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("YouTube Data:", data);
          displayVideos(data.items);
        })
        .catch((error) => console.error("Error fetching YouTube data:", error));
    }

    function displayVideos(videos) {
      videoList.innerHTML = "";
      videos.forEach((video) => {
        const li = document.createElement("li");
        li.textContent = video.snippet.title;
        li.dataset.videoId = video.id.videoId;
        li.addEventListener("click", () => loadVideo(video.id.videoId));
        videoList.appendChild(li);
      });
    }

    // function loadVideo(videoId) {
    //   console.log("Loading video:", videoId);
    //   currentVideoId = videoId;
    //   player.loadVideoById(videoId);
    //   isPlaying = true;
    //   updatePlayPauseButton();
    // }

    function loadVideo(videoId) {
      if (player && typeof player.loadVideoById === 'function') {
        console.log("Loading video:", videoId);
        currentVideoId = videoId;
        player.loadVideoById(videoId);
        isPlaying = true;
        updatePlayPauseButton();
      } else {
        console.error("Player is not ready.");
      }
    }

    playPauseButton.addEventListener("click", () => {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      isPlaying = !isPlaying;
      updatePlayPauseButton();
    });

    nextButton.addEventListener("click", () => {
      playNextVideo();
    });

    prevButton.addEventListener("click", () => {
      playPrevVideo();
    });

    function playNextVideo() {
      const videos = Array.from(videoList.children);
      const currentIndex = videos.findIndex(
        (video) => video.dataset.videoId === currentVideoId
      );
      const nextIndex = (currentIndex + 1) % videos.length;
      loadVideo(videos[nextIndex].dataset.videoId);
    }

    function playPrevVideo() {
      const videos = Array.from(videoList.children);
      const currentIndex = videos.findIndex(
        (video) => video.dataset.videoId === currentVideoId
      );
      const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
      loadVideo(videos[prevIndex].dataset.videoId);
    }

    function updatePlayPauseButton() {
      playPauseButton.textContent = isPlaying ? "Pause" : "Play";
    }

    volumeSlider.addEventListener("input", (e) => player.setVolume(e.target.value));

    shuffleButton.addEventListener("click", () => (isShuffling = !isShuffling));
    repeatButton.addEventListener("click", () => (isRepeating = !isRepeating));

    function playRandomVideo() {
      const videos = Array.from(videoList.children);
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      loadVideo(randomVideo.dataset.videoId);
    }
  })
  .catch(error => console.error("Error fetching API key:", error));
