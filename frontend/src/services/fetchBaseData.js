const abortcontroller = new AbortController();
const signal = abortcontroller.signal;

const fetchAPI = async (url, payload) => {
  const response = await fetch(url, payload);
  return response.json();
};

async function fetchGraphData(hashtags, language, setError) {
  const url = "http://localhost/get-graph";
  const requestBody = {
    hashtags: hashtags.split(" "),
  };

  if (language !== "") {
    requestBody["languages"] = language.split(" ");
  }
  if (true) {
    requestBody["filter_node_frequency"] = 1;
  }
  if (true) {
    requestBody["filter_link_frequency"] = 1;
  }

  const payload = {
    method: "POST",
    body: JSON.stringify(requestBody),
    signal: signal,
  };

  const graphData = await fetchAPI(url, payload)
    .then((data) => {
      data.graph_data.links.forEach((link) => {
        const a = data.graph_data.nodes[link.source];
        const b = data.graph_data.nodes[link.target];
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      });
      data.communities.sort((a, b) => {
        return b.length - a.length;
      });
      return data;
    })
    .catch((err) => {
      console.log(err);
      setError(true);
    });
  return graphData;
}

export default fetchGraphData;
