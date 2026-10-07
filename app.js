const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const tabs = document.querySelectorAll(".code-tab");
const panes = document.querySelectorAll(".code-pane");
const copyButton = document.querySelector(".copy-button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panes.forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === target));
  });
});

copyButton?.addEventListener("click", async () => {
  const activeCode = document.querySelector(".code-pane.active code");
  if (!activeCode) return;

  try {
    await navigator.clipboard.writeText(activeCode.innerText);
    const previous = copyButton.textContent;
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = previous;
    }, 1400);
  } catch {
    copyButton.textContent = "Select + copy";
  }
});
