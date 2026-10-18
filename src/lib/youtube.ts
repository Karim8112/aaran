export function convertToEmbedUrl(youtubeUrl: string): string {
  // Replace 'watch?v=' with 'embed/'
  let embedUrl = youtubeUrl.replace("watch?v=", "embed/");

  // Find the index of '?list='
  const listIndex = embedUrl.indexOf("?list=");
  if (listIndex !== -1) {
    // Find the first '&' appearing after '?list='
    const ampIndex = embedUrl.indexOf("&", listIndex);
    if (ampIndex !== -1) {
      // Delete everything from '&' onwards
      embedUrl = embedUrl.substring(0, ampIndex);
    }
  } else {
    // If there is no '?list=', just remove any query parameters starting with '&'
    const ampIndex = embedUrl.indexOf("&");
    if (ampIndex !== -1) {
      embedUrl = embedUrl.substring(0, ampIndex);
    }
  }

  console.log("this is the embed url", embedUrl);

  return embedUrl;
}

export function getYouTubeThumbnailUrl(
  youtubeUrl: string,
  quality:
    | "default"
    | "mqdefault"
    | "hqdefault"
    | "sddefault"
    | "maxresdefault" = "hqdefault",
): string | false {
  try {
    const url = new URL(youtubeUrl);
    let videoId = url.searchParams.get("v");

    // Handle standard watch URLs or other variations
    if (!videoId) {
      const pathSegments = url.pathname.split("/");
      if (url.hostname.includes("youtu.be")) {
        videoId = pathSegments[1];
      } else if (pathSegments.includes("embed") || pathSegments.includes("v")) {
        const index =
          pathSegments.indexOf("embed") !== -1
            ? pathSegments.indexOf("embed")
            : pathSegments.indexOf("v");
        videoId = pathSegments[index + 1];
      }
    }

    // If no video ID could be found, return false
    if (!videoId) {
      return false;
    }

    // Strip any lingering parameters from the video ID string
    videoId = videoId.split("&")[0];

    if (!videoId) {
      return false;
    }

    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  } catch {
    // Catches errors when a non-URL string (like "dfjghdfgjsdkj") is passed
    return false;
  }
}

// Example usage:
console.log(
  getYouTubeThumbnailUrl("https://www.youtube.com/watch?v=PUdyuKaGQd4"),
);
// Output: https://img.youtube.com/vi/PUdyuKaGQd4/hqdefault.jpg

console.log(getYouTubeThumbnailUrl("dfjghdfgjsdkj"));
// Output: false
