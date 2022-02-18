export const KEY = "foo";

type SpreadsheetDef = {
  gid: string;
  width: string;
};

const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/19t-y9tzXteBJf3nv9m_roSUSC2lKtEl7WQaQa9uSnRc/htmlembed/sheet?gid=";

const SPREADSHEETS: Array<SpreadsheetDef> = [
  {
    // Final
    gid: "1756187223",
    width: "496px",
  },
  {
    // Round 1
    gid: "1403145623",
    width: "1080px",
  },
  {
    // Round 2
    gid: "1287803979",
    width: "1080px",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById(
    "GoogleScoreCard"
  ) as HTMLIFrameElement;
  iframe.src = SPREADSHEET_URL + SPREADSHEETS[1].gid;
  let iframeSrc = iframe?.src;

  const iframeDisplay = document.querySelector(
    "div.score-card-container"
  ) as HTMLElement;

  /**
   * When the iframe is loaded, re-show the container by raising
   * it's opacity.
   */
  const loadFrame = () => {
    iframeDisplay.style.opacity = "1";
  };
  iframe.addEventListener("load", loadFrame, true);

  setInterval(() => {
    console.log("refreshing iframe");
    // https://stackoverflow.com/a/821373/356016
    // include a cache buster at the end of the URL
    iframe.contentWindow.location.replace(iframeSrc + "&cb=" + Math.ceil(Math.random() * 10_000));
  }, 10_000);

  const selectSheet = (event: Event) => {
    // begin to hide, based on transition duration
    iframeDisplay.style.opacity = "0";

    const selection: number = parseInt(
      (event?.currentTarget as HTMLElement)?.dataset?.selection || "1",
      10
    );

    setTimeout(() => {
      iframe.src = SPREADSHEET_URL + SPREADSHEETS[selection].gid;
      iframeSrc = iframe?.src;
      document.documentElement.style.setProperty(
        "--iframe-width",
        SPREADSHEETS[selection].width
      );
    }, 100); // delay should be the same as the transition duration
  };

  // bind onclick events to selector controls
  const selectors: NodeList = document.querySelectorAll(
    "div.round-selector > div"
  );
  selectors.forEach((el) => {
    el.addEventListener("click", selectSheet, true);
  });
});
