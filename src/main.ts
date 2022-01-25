// import "./style.scss";

export const KEY = "foo";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    console.log("got here");
  }, 10_000);
});
