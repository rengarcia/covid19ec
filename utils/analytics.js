import ReactGA from "react-ga";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { googleAnalyticsId },
} = getConfig();

const newSiteId = "covid19ec";

export const initGA = () => {
  console.log("Google Analytics init");
  ReactGA.initialize(googleAnalyticsId);
};

export const logPageView = () => {
  console.log(`Logging pageview for ${newSiteId}`);
  ReactGA.set({ page: newSiteId });
  ReactGA.pageview(newSiteId);
};
