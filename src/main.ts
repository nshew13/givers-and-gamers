export const KEY = "foo";

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById(
    "GoogleScoreCard"
  ) as HTMLIFrameElement;
  const iframeSrc = iframe?.src;

  setInterval(() => {
    console.log("refreshing iframe");
    // refresh with a cache buster
    iframe.src = iframeSrc + "&cb=" + Math.ceil(Math.random() * 10_000);
  }, 10_000);
});
