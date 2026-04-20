const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

reveals.forEach((element) => observer.observe(element));

const YOUTUBE_CONFIG = {
  channelId: "",
  channelUrl: "https://www.youtube.com/@MoreGooderShow",
  maxVideos: 3,
  featuredVideos: [
    {
      title: "Vlog | Ep. 1",
      url: "https://youtu.be/Mx6yu1LhjTc?si=DO7I_-c4WKvnd-uw",
      videoId: "Mx6yu1LhjTc",
      publishedLabel: "Latest Vlog",
    },
    {
      title: "Podcast | Ep. 1",
      url: "https://youtu.be/y-w5UJ6scvE?si=sgu1tiOu86gV38HL",
      videoId: "y-w5UJ6scvE",
      publishedLabel: "Latest Podcast",
    },
  ],
};

const videosGrid = document.querySelector("#videos-grid");
const videosStatus = document.querySelector("#videos-status");

const setVideoStatus = (message) => {
  if (!videosStatus) {
    return;
  }

  videosStatus.textContent = message;
};

const parsePublishedDate = (dateText) => {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const appendSubscribeCardIfNeeded = () => {
  if (!videosGrid) {
    return;
  }

  const renderedCards = videosGrid.querySelectorAll(".video-card").length;
  if (renderedCards >= YOUTUBE_CONFIG.maxVideos) {
    return;
  }

  const subscribeCard = document.createElement("a");
  subscribeCard.className = "video-card video-card-subscribe";
  subscribeCard.href = YOUTUBE_CONFIG.channelUrl;
  subscribeCard.target = "_blank";
  subscribeCard.rel = "noopener noreferrer";
  subscribeCard.setAttribute("aria-label", "Subscribe on YouTube");

  const copy = document.createElement("div");
  copy.className = "video-card-copy";

  const heading = document.createElement("h3");
  heading.textContent = "Subscribe on YouTube";

  const meta = document.createElement("p");
  meta.textContent = "Catch every new vlog and podcast drop.";

  copy.appendChild(heading);
  copy.appendChild(meta);
  subscribeCard.appendChild(copy);
  videosGrid.appendChild(subscribeCard);
};

const renderFeaturedVideos = (items) => {
  if (!videosGrid) {
    return;
  }

  videosGrid.innerHTML = "";

  items.forEach((item) => {
    const link = document.createElement("a");
    link.className = "video-card";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Watch ${item.title} on YouTube`);

    const thumbnail = document.createElement("img");
    thumbnail.src = `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
    thumbnail.alt = item.title;
    thumbnail.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "video-card-copy";

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const meta = document.createElement("p");
    meta.textContent = item.publishedLabel;

    copy.appendChild(heading);
    copy.appendChild(meta);
    link.appendChild(thumbnail);
    link.appendChild(copy);

    videosGrid.appendChild(link);
  });

  appendSubscribeCardIfNeeded();
};

const renderVideoCards = (items) => {
  if (!videosGrid) {
    return;
  }

  videosGrid.innerHTML = "";

  items.forEach((item) => {
    const videoId = item.querySelector("videoId")?.textContent?.trim();
    const title = item.querySelector("title")?.textContent?.trim() || "New episode";
    const published = parsePublishedDate(item.querySelector("published")?.textContent || "");

    if (!videoId) {
      return;
    }

    const link = document.createElement("a");
    link.className = "video-card";
    link.href = `https://www.youtube.com/watch?v=${videoId}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Watch ${title} on YouTube`);

    const thumbnail = document.createElement("img");
    thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = title;
    thumbnail.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "video-card-copy";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const meta = document.createElement("p");
    meta.textContent = published || "Recently published";

    copy.appendChild(heading);
    copy.appendChild(meta);
    link.appendChild(thumbnail);
    link.appendChild(copy);

    videosGrid.appendChild(link);
  });

  appendSubscribeCardIfNeeded();
};

const loadLatestVideos = async () => {
  if (!videosGrid || !videosStatus) {
    return;
  }

  if (!YOUTUBE_CONFIG.channelId) {
    renderFeaturedVideos(YOUTUBE_CONFIG.featuredVideos);
    setVideoStatus("Showing your featured latest videos.");
    return;
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CONFIG.channelId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const items = Array.from(xmlDoc.querySelectorAll("entry")).slice(
      0,
      YOUTUBE_CONFIG.maxVideos
    );

    if (items.length === 0) {
      setVideoStatus("No videos found yet. Check your channel ID and try again.");
      return;
    }

    renderVideoCards(items);
    setVideoStatus(`Showing ${items.length} most recent videos.`);
  } catch {
    renderFeaturedVideos(YOUTUBE_CONFIG.featuredVideos);
    setVideoStatus("Could not auto-load feed. Showing your featured latest videos.");
  }
};

loadLatestVideos();
