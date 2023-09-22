# pv-bugtracker-vue

import PvBugtrackerVue from "pv-bugtracker-vue";

Vue.use(PvBugtrackerVue, {
    app_name: "Test App",                           // App name
    token_url: "https://example.com",                // Token url for Login 
    debug: true,                                    // Enable console logger
    bug_report_url: "https://example.com"           // Bug report url 
});

Than use 

<pv-bugtracker
    :reporter="{userobject}"
    :bug-logo="log-url"
></pv-bugtracker>

