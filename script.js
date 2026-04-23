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
      title: "Running a Real Business: Trucks, Sales Training & Curb Appeal",
      url: "https://youtu.be/BC4kFtcMIQo",
      videoId: "BC4kFtcMIQo",
      publishedLabel: "Just Released",
      type: "Podcast",
      description:
        "Trucks, sales training, and curb appeal — what it actually takes to run a real business.",
      isNew: true,
    },
    {
      title: "Vlog | Ep. 1",
      url: "https://youtu.be/Mx6yu1LhjTc?si=DO7I_-c4WKvnd-uw",
      videoId: "Mx6yu1LhjTc",
      publishedLabel: "Recent Vlog",
      type: "Vlog",
      episodeNumber: "Ep. 01",
      description:
        "Behind the scenes of the debut — how the show came together and what's coming next.",
    },
    {
      title: "Podcast | Ep. 1",
      url: "https://youtu.be/y-w5UJ6scvE?si=sgu1tiOu86gV38HL",
      videoId: "y-w5UJ6scvE",
      publishedLabel: "Recent Podcast",
      type: "Podcast",
      episodeNumber: "Ep. 01",
      description:
        "Settling in, setting the tone, and asking the questions we came here to ask.",
    },
  ],
};

const videosGrid = document.querySelector("#videos-grid");
const episodeSpotlight = document.querySelector("#episode-spotlight");
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

const buildPlayBadge = () => {
  const badge = document.createElement("span");
  badge.className = "play-badge";
  badge.setAttribute("aria-hidden", "true");
  return badge;
};

const renderSpotlight = (item) => {
  if (!episodeSpotlight || !item) {
    return;
  }

  episodeSpotlight.innerHTML = "";

  const link = document.createElement("a");
  link.className = "episode-spotlight-card";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Watch ${item.title} on YouTube`);

  const media = document.createElement("div");
  media.className = "episode-spotlight-media";

  const thumbnail = document.createElement("img");
  thumbnail.src = `https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg`;
  thumbnail.alt = item.title;
  thumbnail.loading = "eager";
  thumbnail.addEventListener("error", () => {
    thumbnail.src = `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
  });

  media.appendChild(thumbnail);
  media.appendChild(buildPlayBadge());

  if (item.isNew) {
    const newBadge = document.createElement("span");
    newBadge.className = "new-badge";
    newBadge.textContent = "New";
    media.appendChild(newBadge);
  }

  const copy = document.createElement("div");
  copy.className = "episode-spotlight-copy";

  const tagRow = document.createElement("div");
  tagRow.className = "episode-tag-row";

  if (item.type) {
    const typeTag = document.createElement("span");
    typeTag.className = "episode-tag";
    typeTag.textContent = item.type;
    tagRow.appendChild(typeTag);
  }

  if (item.episodeNumber) {
    const epTag = document.createElement("span");
    epTag.className = "episode-tag episode-tag-muted";
    epTag.textContent = item.episodeNumber;
    tagRow.appendChild(epTag);
  }

  const label = document.createElement("p");
  label.className = "episode-spotlight-label";
  label.textContent = item.publishedLabel || "Latest drop";

  const heading = document.createElement("h3");
  heading.className = "episode-spotlight-title";
  heading.textContent = item.title;

  copy.appendChild(label);
  if (tagRow.children.length > 0) {
    copy.appendChild(tagRow);
  }
  copy.appendChild(heading);

  if (item.description) {
    const description = document.createElement("p");
    description.className = "episode-spotlight-description";
    description.textContent = item.description;
    copy.appendChild(description);
  }

  const cta = document.createElement("span");
  cta.className = "episode-spotlight-cta";
  cta.textContent = "Watch Episode";
  copy.appendChild(cta);

  link.appendChild(media);
  link.appendChild(copy);
  episodeSpotlight.appendChild(link);
};

const clearSpotlight = () => {
  if (episodeSpotlight) {
    episodeSpotlight.innerHTML = "";
  }
};

const buildVideoCard = ({ url, videoId, title, meta }) => {
  const link = document.createElement("a");
  link.className = "video-card";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Watch ${title} on YouTube`);

  const media = document.createElement("div");
  media.className = "video-card-media";

  const thumbnail = document.createElement("img");
  thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  thumbnail.alt = title;
  thumbnail.loading = "lazy";
  media.appendChild(thumbnail);
  media.appendChild(buildPlayBadge());

  const copy = document.createElement("div");
  copy.className = "video-card-copy";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const metaLine = document.createElement("p");
  metaLine.textContent = meta;

  copy.appendChild(heading);
  copy.appendChild(metaLine);
  link.appendChild(media);
  link.appendChild(copy);
  return link;
};

const renderFeaturedVideos = (items) => {
  if (!videosGrid) {
    return;
  }

  videosGrid.innerHTML = "";

  const [spotlightItem, ...rest] = items;

  if (spotlightItem) {
    renderSpotlight(spotlightItem);
  } else {
    clearSpotlight();
  }

  rest.forEach((item) => {
    videosGrid.appendChild(
      buildVideoCard({
        url: item.url,
        videoId: item.videoId,
        title: item.title,
        meta: item.publishedLabel,
      })
    );
  });

  appendSubscribeCardIfNeeded();
};

const renderVideoCards = (items) => {
  if (!videosGrid) {
    return;
  }

  videosGrid.innerHTML = "";

  const parsed = items
    .map((item) => {
      const videoId = item.querySelector("videoId")?.textContent?.trim();
      const title =
        item.querySelector("title")?.textContent?.trim() || "New episode";
      const published = parsePublishedDate(
        item.querySelector("published")?.textContent || ""
      );
      return { videoId, title, published };
    })
    .filter((entry) => entry.videoId);

  if (parsed.length === 0) {
    clearSpotlight();
    return;
  }

  const [spotlightRaw, ...rest] = parsed;

  renderSpotlight({
    title: spotlightRaw.title,
    url: `https://www.youtube.com/watch?v=${spotlightRaw.videoId}`,
    videoId: spotlightRaw.videoId,
    publishedLabel: spotlightRaw.published
      ? `Released ${spotlightRaw.published}`
      : "Latest drop",
    isNew: true,
  });

  rest.forEach((entry) => {
    videosGrid.appendChild(
      buildVideoCard({
        url: `https://www.youtube.com/watch?v=${entry.videoId}`,
        videoId: entry.videoId,
        title: entry.title,
        meta: entry.published || "Recently published",
      })
    );
  });

  appendSubscribeCardIfNeeded();
};

const loadLatestVideos = async () => {
  if (!videosGrid || !videosStatus) {
    return;
  }

  if (!YOUTUBE_CONFIG.channelId) {
    renderFeaturedVideos(YOUTUBE_CONFIG.featuredVideos);
    setVideoStatus("Showing the latest episodes.");
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
      setVideoStatus("No episodes found yet. Check your channel ID and try again.");
      return;
    }

    renderVideoCards(items);
    setVideoStatus(`Showing ${items.length} most recent episodes.`);
  } catch {
    renderFeaturedVideos(YOUTUBE_CONFIG.featuredVideos);
    setVideoStatus("Could not auto-load feed. Showing featured latest episodes.");
  }
};

loadLatestVideos();
