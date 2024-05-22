document.addEventListener("DOMContentLoaded", function () {
  const loadPartial = (partialName) => {
    return fetch(`templates/partials/${partialName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        Handlebars.registerPartial(partialName, templateSource);
      });
  };

  const loadTemplate = (templateName, context) => {
    fetch(`templates/${templateName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        const template = Handlebars.compile(templateSource);
        const html = template(context);
        document.getElementById("content").innerHTML = html;
      })
      .catch((error) => console.error("Error loading the template:", error));
  };

  const loadAndRenderPartial = (partialName, elementId) => {
    return fetch(`templates/partials/${partialName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        const template = Handlebars.compile(templateSource);
        document.getElementById(elementId).innerHTML = template();
      });
  };

  const initializePartials = () => {
    return Promise.all([
      loadPartial("header"),
      loadPartial("footer"),
      loadPartial("navigation"),
      loadPartial("person"),
    ]).then(() => {
      return Promise.all([
        loadAndRenderPartial("header", "header"),
        loadAndRenderPartial("footer", "footer"),
        loadAndRenderPartial("navigation", "navigation"),
      ]);
    });
  };

  // Register a helper
  Handlebars.registerHelper("uppercase", (str) => {
    return str.toUpperCase();
  });

  // Event listeners for buttons
  document
    .getElementById("navigation")
    .addEventListener("click", (event) => {
      if (event.target.id === "home-btn") {
        const context = {
          title: "Welcome to My Website",
          body:
            "This is a dynamically generated content area using Handlebars.",
          persons: [
            { name: "John", age: 30 },
            { name: "Jane", age: 25 },
            { name: "Doe", age: 40 },
          ],
        };
        loadTemplate("main-content", context);
      } else if (event.target.id === "about-btn") {
        const context = {
          title: "About Us",
          description:
            "We are a company that values excellence and innovation.",
        };
        loadTemplate("about-content", context);
      }
    });

  // Initialize partials and load the default template
  initializePartials().then(() => {
    document.getElementById("home-btn").click();
  });
});
