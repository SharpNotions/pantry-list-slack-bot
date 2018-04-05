const parse = require("urlencoded-body-parser");
const fetch = require("node-fetch");

const { send } = require("micro");
const parseRequestText = text => {
  const descriptionIncluded = text.includes("|");
  let parsedRequestText;

  if (descriptionIncluded) {
    splitText = text.split("|");
    parsedRequestText = {
      item_name: splitText[0],
      item_details: { description: splitText[1] }
    };
  } else {
    parsedRequestText = {
      item_name: text,
      item_details: { description: "" }
    };
  }
  return parsedRequestText;
};

module.exports = async (req, res) => {
  const { text, team_domain, token, user_name } = await parse(req);

  if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
    send(res, 401, "Token did not equal verification token");
    return;
  }

  if (text === "") {
    send(res, 200, {
      response_type: "ephemeral",
      text:
        "Sorry, that didn't work. Item name is required. (usage hint: /add Item Name|Description)"
    });
    return;
  }

  const data = parseRequestText(text);
  const email = `${user_name}@${team_domain}.com`;
  const url = `${process.env.PANTRY_LIST_API_URL}/item?user=${email}`;

  fetch(url, {
    method: "POST",
    headers: {
      authorization: `Basic ${process.env.SLACK_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.text())
    .then(body => console.log(body))
    .catch(console.error);
};
