const sections = [...document.querySelectorAll(".content-section")];
const links = [...document.querySelectorAll(".toc-link")];
const heading = document.getElementById("currentHeading");

const themes = {
  opening: "mind",
  question: "mind",
  cognitive: "cosmos",
  information: "cell",
  chain: "mind",
  emergence: "tech",
  transition: "dark",
  caveat: "mind",
  open: "question"
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    const title = entry.target.dataset.title;
    heading.textContent = title;
    document.body.dataset.theme = themes[id] || "mind";
    links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + id));
  });
}, {rootMargin:"-20% 0px -65% 0px", threshold:0});

sections.forEach(section => observer.observe(section));
