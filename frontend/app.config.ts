import appJson from "./app.json";

export default {
    ...appJson.expo,

    android: {
        ...appJson.expo.android,
        googleServicesFile:
            process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
};
