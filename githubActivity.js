const https = require("https");

function fetchGitHubActivity(username) {
  const url = `https://api.github.com/users/${username}/events`;

  https
    .get(url, { headers: { "User-Agent": "github-activity-cli" } }, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const events = JSON.parse(data);
          events.slice(0, 5).forEach((event) => {
            if (event.type === "PushEvent") {
              console.log(`- Pushed to ${event.repo.name}`);
            } else if (event.type === "IssuesEvent") {
              console.log(
                `- ${event.payload.action} issue in ${event.repo.name}`
              );
            } else if (event.type === "WatchEvent") {
              console.log(`- Starred ${event.repo.name}`);
            } else {
              console.log(`- ${event.type} in ${event.repo.name}`);
            }
          });
        } else {
          console.error("Error: Unable to fetch activity");
        }
      });
    })
    .on("error", (err) => {
      console.error("Error: ", err.message);
    });
}

const username = process.argv[2];

if (!username) {
  console.log("Usage: node githubActivity.js <username>");
} else {
  fetchGitHubActivity(username);
}
