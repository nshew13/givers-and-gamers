export {};

interface SpreadsheetDef {
  gid: string;
  width: string;
}

/**
 * N.B. When copying the Sheet for a new event, the GIDs will remain the same.
 *      Only the URL needs to be updated.
 */
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1nMfAGuKUGR9BZn5NQnHBhuDmKAZgfwbdc-d6ted16EE/htmlembed/sheet?gid=';

const SPREADSHEETS: SpreadsheetDef[] = [
  {
    // Final
    gid: '1756187223',
    width: '751px',
  },
  {
    // Round 1
    gid: '1403145623',
    width: '1126px',
  },
  {
    // Round 2
    gid: '1287803979',
    width: '1126px',
  },
];

// execute when loaded

const iframe = document.getElementById('GoogleScoreCard') as HTMLIFrameElement;
// @ts-expect-error SPREADSHEETS[1].gid is hard-coded above
iframe.src = `${SPREADSHEET_URL}${SPREADSHEETS[1].gid}`;
let iframeSrc = iframe?.src;

const iframeDisplay = document.querySelector('div.score-card-container') as HTMLElement;

/**
 * When the iframe is loaded, re-show the container by raising
 * it's opacity.
 */
const loadFrame = (): void => {
  iframeDisplay.style.opacity = '1';
};
iframe.addEventListener('load', loadFrame, true);

setInterval(() => {
  console.log('refreshing iframe');
  // https://stackoverflow.com/a/821373/356016
  // include a cache buster at the end of the URL
  iframe.contentWindow?.location.replace(`${iframeSrc}&cb=${Math.ceil(Math.random() * 10_000)}`);
}, 10_000);

const selectSheet = (event: Event): void => {
  // begin to hide, based on transition duration
  iframeDisplay.style.opacity = '0';

  const selection: number = parseInt(
    (event?.currentTarget as HTMLElement)?.dataset?.selection ?? '1',
    10,
  );

  setTimeout(() => {
    if (SPREADSHEETS?.[selection] !== undefined) {
      // @ts-expect-error SPREADSHEETS[selection] is checked above
      iframe.src = `${SPREADSHEET_URL}${SPREADSHEETS[selection].gid}`;
      iframeSrc = iframe?.src;
      document.documentElement.style.setProperty(
        '--iframe-width',
        SPREADSHEETS[selection]?.width ?? '0',
      );
    }
  }, 100); // delay should be the same as the transition duration
};

// bind onclick events to selector controls
const selectors: NodeList = document.querySelectorAll(
  'div.round-selector > div',
);
selectors.forEach((el) => {
  el.addEventListener('click', selectSheet, true);
});
