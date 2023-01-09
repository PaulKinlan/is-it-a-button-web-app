import { Head } from "$fresh/runtime.ts";
import FileDrop from "../islands/File.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Is it a button?</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
        <script src="/script.js" defer></script>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <body>
        <div class="wrapper">
          <div class="content" role="main">
            <h1 class="title">Is it a button?</h1>
            <div>
            <div>
              <h2>What is this?</h2>
              <p>This is an early experiment to see if I can build an ML model that can classify HTML elements that look like buttons or links?</p>
              <p>I intend to use it as an accessbility audit in Lighthouse to detect if an <code>&lt;a&gt;</code> element visually looks like a <code>&lt;button&gt;</code> and suggest to the author that they might want to consider changing the styling. <a href="https://paul.kinlan.me/button-and-link-scraping-for-ml-training/">Learn more here</a></p>
            </div>
            </div>
            <FileDrop accept="image/*" multiple />
          </div>
        </div>

      </body>
    </>
  );
}
