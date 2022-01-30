export const KEY = "foo";

type SpreadsheetDef = {
  gid: string;
  width: string;
};

const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/19t-y9tzXteBJf3nv9m_roSUSC2lKtEl7WQaQa9uSnRc/htmlembed/sheet?gid=";

const SPREADSHEETS: Array<SpreadsheetDef> = [
  {
    // Finals
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

  setInterval(() => {
    console.log("refreshing iframe");
    // refresh with a cache buster
    iframe.src = iframeSrc + "&cb=" + Math.ceil(Math.random() * 10_000);
  }, 10_000);

  const selectSheet = (event: Event) => {
    const selection: number = parseInt(
      (event?.currentTarget as HTMLElement)?.dataset?.selection || "1",
      10
    );

    iframe.src = SPREADSHEET_URL + SPREADSHEETS[selection].gid;
    iframeSrc = iframe?.src;
    document.documentElement.style.setProperty(
      "--iframe-width",
      SPREADSHEETS[selection].width
    );
  };

  // bind onclick events to selector controls
  const selectors: NodeList = document.querySelectorAll(
    "div.round-selector > div"
  );
  selectors.forEach((el) => {
    el.addEventListener("click", selectSheet, true);
  });
});
