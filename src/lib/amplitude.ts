import * as amplitude from "@amplitude/analytics-browser";

amplitude.init(process.env.REACT_APP_AMPLITUDE_API_KEY as string, {
  autocapture: false,
  logLevel: 3,
});

export default amplitude;
