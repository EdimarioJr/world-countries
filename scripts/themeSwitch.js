var bswitch = document.getElementsByClassName("mode")[0];

function setTheme(themeName) {
  sessionStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}

function toggleTheme() {
  if (sessionStorage.getItem("theme") === "dark-theme") setTheme("light-theme");
  else setTheme("dark-theme");
}

(function () {
  if (sessionStorage.getItem("theme") === 'dark-theme') 
    setTheme("dark-theme");
    else setTheme('light-theme')
})();

bswitch.addEventListener("click", toggleTheme);
