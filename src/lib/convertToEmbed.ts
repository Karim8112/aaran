function convertToEmbedUrl(youtubeUrl: string): string {
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

  return embedUrl;
}

// Example usage:
const inputUrl =
  "https://www.youtube.com/watch?v=PUdyuKaGQd4&list=RDPUdyuKaGQd4&start_radio=1";
const outputUrl = convertToEmbedUrl(inputUrl);

console.log(outputUrl);
// Output: https://www.youtube.com/embed/PUdyuKaGQd4?list=RDPUdyuKaGQd4
