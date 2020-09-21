const abortcontroller = new AbortController();
const signal = abortcontroller.signal;

const fetchAPI = async (url, payload) => {
  const response = await fetch(url, payload);
  return response.json();
};

async function fetchHashtagTweets(
  hashtags,
  language,
  target_hashtag,
  setError
) {
  //   const [data, setData] = useState({ nodes: [], links: [] });
  //   const [hasError, setErrors] = useState(false);
  const url = "http://localhost/get-tweets-for-hashtag";
  const requestBody = {
    hashtags: hashtags.split(" "),
    target_hashtag: target_hashtag,
  };

  if (language !== "") {
    requestBody["languages"] = language.split(" ");
  }

  const payload = {
    method: "POST",
    body: JSON.stringify(requestBody),
    signal: signal,
  };

  const tweetsData = await fetchAPI(url, payload)
    .then((data) => {
      console.log("This is your data", data);
      return data;
    })
    .catch((err) => {
      console.log(err);
      setError(true);
    });
  return tweetsData;
}

export default fetchHashtagTweets;
