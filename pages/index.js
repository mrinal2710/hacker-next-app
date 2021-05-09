import { Component } from "react";
import fetch from "isomorphic-fetch";
import Error from "next/error";
import StoryList from "../components/StoryList";
import Layout from "../components/Layout";
import Link from "next/link";
import axios from 'axios';

class Index extends Component {
  static async getInitialProps({ req, res, query }) {
    let stories;
    let page;
    try {
      page = parseInt(query.page) || 1;
      const { data } = await axios.get(`https://node-hnapi.herokuapp.com/news?page=${page}`);
      stories = data;
    } catch (err) {
      console.log(err);
      stories = [];
    }
    return { page, stories };
  }

  componentDidMount() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registeration => {
          console.log("service worker registration successful", registeration);
        })
        .catch(err => {
          console.warn("service worker registration failed", err.message);
        });
    }
  }
  render() {
    const { stories, page } = this.props;
    if (stories.length === 0) {
      return <Error statusCode={503} />;
    }
    return (
      <Layout title="Hacker Next">
        <StoryList stories={stories} />
        <footer>
          <Link href={`/?page=${page + 1}`}>
            <a>Next Page ({page + 1})</a>
          </Link>
        </footer>
        <style jsx>
          {`
            footer {
              padding: 1em;
            }
            footer a {
              font-weight: bold;
              color: black;
              text-decoration: none;
            }
          `}
        </style>
      </Layout>
    );
  }
}

export default Index;
