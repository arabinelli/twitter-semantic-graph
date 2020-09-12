const abortcontroller = new AbortController();
const signal = abortcontroller.signal;

const fetchAPI = async (url, payload) => {
  const response = await fetch(url, payload);
  return response.json();
};

async function fetchHashtagTweets(hashtags, language, target_hashtag) {
  //   const [data, setData] = useState({ nodes: [], links: [] });
  //   const [hasError, setErrors] = useState(false);
  const url = "http://localhost/get-tweets-for-hashtag";
  const payload = {
    method: "POST",
    body: JSON.stringify({
      hashtags: hashtags.split(" "),
      languages: language.split(" "),
      target_hashtag: target_hashtag,
    }),
    signal: signal,
  };

  const tweetsData = await fetchAPI(url, payload)
    .then((data) => {
      console.log("This is your data", data);
      return data;
    })
    .catch((err) => {
      console.log(err);
      //   setErrors(true);
    });
  return tweetsData;
}

export default fetchHashtagTweets;
