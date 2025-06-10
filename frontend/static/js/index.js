import HomeView from "./views/HomeView.js";
import CreateTodoView from "./views/CreateTodoView.js";
import CreateTeamView from "./views/CreateTeamView.js";
import JoinTeamView from "./views/JoinTeamView.js";
import LoginView from "./views/LoginView.js";
import RegisterView from "./views/RegisterView.js";
import RequestView from "./views/RequestView.js";
import TeamStatsView from "./views/TeamStatsView.js";
import FullTodoView from "./views/FullTodoView.js";
import TwoFactorSetupView from "./views/TwoFactorSetupView.js";
import ProfileView from "./views/ProfileView.js";
import { AuthManager } from "./utils/auth.js";
import RoleView from "./views/RoleView.js";

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
    { path: "/", view: LoginView, requiresAuth: false },
    { path: "/register", view: RegisterView, requiresAuth: false },
    { path: "/setup-2fa", view: TwoFactorSetupView, requiresAuth: true },
    { path: "/profile", view: ProfileView, requiresAuth: false },
    { path: "/home", view: HomeView, requiresAuth: false },
    { path: "/create/todo", view: CreateTodoView, requiresAuth: false },
    { path: "/create/team", view: CreateTeamView, requiresAuth: false },
    { path: "/team/join", view: JoinTeamView, requiresAuth: false },
    { path: "/team/report", view: TeamStatsView, requiresAuth: false },
    { path: "/requests", view: RequestView, requiresAuth: false },
    { path: "/roles", view: RoleView, requiresAuth: false },
    { path: "/todo", view: FullTodoView, requiresAuth: false }
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
  // Check authentication
  const isAuthenticated = AuthManager.isAuthenticated();

  const route = currentRoute.route;
    
  const hasProvisionalToken = AuthManager.hasProvisionalToken();

  if (route.path === "/setup-2fa") {
    if (!hasProvisionalToken) {
      navigator("/");
      return;
    }
    if (isAuthenticated) {
      navigator("/home");
      return;
    }
  }

  // Redirect unauthenticated users to login
  if (route.requiresAuth && !isAuthenticated) {
    navigator("/");
    return;
  }

    let isNormalUser = true;
    let isTeamLead = false;

    if(route.path == '/requests'|| route.path == '/roles'){
        isNormalUser = await AuthManager.isNormalUser();
        const teamLeadTeams = await AuthManager.teamLeadTeams();
        isTeamLead = teamLeadTeams != 0;
    }

  if((route.path === '/requests' || route.path === '/roles') && isNormalUser && !isTeamLead){
    navigator('/home');
    return;
  }

  // Redirect authenticated users away from login/register
  if (
    !route.requiresAuth &&
    isAuthenticated &&
    (route.path === "/" || route.path === "/register")
  ) {
    navigator("/home");
    return;
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
