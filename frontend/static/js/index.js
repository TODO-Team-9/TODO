import HomeView from "./views/HomeView.js";
import CreateTodoView from "./views/CreateTodoView.js";
import CreateTeamView from "./views/CreateTeamView.js";
import JoinTeamView from "./views/JoinTeamView.js";
import LoginView from "./views/LoginView.js";
import RegisterView from "./views/RegisterView.js";
import RequestView from "./views/RequestView.js";
import TeamStatsView from "./views/TeamStatsView.js";
import FullTodoView from "./views/FullTodoView.js";

let currentView = null;

export const navigator = (url) => {
  history.pushState(null, null, url);
  router();
};

export const router = async () => {
  if (currentView && typeof currentView.cleanup === "function") {
    currentView.cleanup();
  }

  const routes = [
    { path: "/", view: LoginView },
    { path: "/register", view: RegisterView },
    { path: "/home", view: HomeView },
    { path: "/create/todo", view: CreateTodoView },
    { path: "/create/team", view: CreateTeamView },
    { path: "/team/join", view: JoinTeamView },
    { path: "/team/report", view: TeamStatsView },
    { path: "/requests", view: RequestView },
    { path: "/todo", view: FullTodoView },
  ];

  const pathToRegex = (path) =>
    new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

  const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1]
    );

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  };

  const possibleRoutes = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let currentRoute = possibleRoutes.find(
    (possibleRoute) => possibleRoute.result !== null
  );

  if (!currentRoute) {
    currentRoute = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new currentRoute.route.view(getParams(currentRoute));
  currentView = view;

  const app = document.querySelector("#app");
  const htmlContent = await view.getHtml();
  app.replaceChildren(htmlContent);

  if (typeof view.mount === "function") {
    view.mount();
  }
};


window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-link]")) {
      event.preventDefault();
      navigator(event.target.href);
    }
  });

  router();
});
