document.addEventListener("DOMContentLoaded", function () {
  function loadPartial(partialName) {
    return fetch(`templates/partials/${partialName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        Handlebars.registerPartial(partialName, templateSource);
      });
  }

  function loadTemplate(templateName, context) {
    fetch(`templates/${templateName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        // Compile the template
        var template = Handlebars.compile(templateSource);

        // Render the template with the data
        var html = template(context);

        // Insert the rendered HTML into the main content area
        document.getElementById("content").innerHTML = html;
      })
      .catch((error) => console.error("Error loading the template:", error));
  }

  function loadAndRenderPartial(partialName, elementId) {
    return fetch(`templates/partials/${partialName}.html`)
      .then((response) => response.text())
      .then((templateSource) => {
        var template = Handlebars.compile(templateSource);
        document.getElementById(elementId).innerHTML = template();
      });
  }

  function initializePartials() {
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
  }

  // Register a helper
  Handlebars.registerHelper("uppercase", function (str) {
    return str.toUpperCase();
  });

  // Event listeners for buttons
  document
    .getElementById("navigation")
    .addEventListener("click", function (event) {
      if (event.target.id === "home-btn") {
        var context = {
          title: "Welcome to My Website",
          body: "This is a dynamically generated content area using Handlebars.",
          persons: [
            { name: "John", age: 30 },
            { name: "Jane", age: 25 },
            { name: "Doe", age: 40 },
          ],
        };
        loadTemplate("main-content", context);
      } else if (event.target.id === "about-btn") {
        var context = {
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
