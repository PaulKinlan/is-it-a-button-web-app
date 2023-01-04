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
            <FileDrop accept="image/*" />
          </div>
        </div>
      </body>
    </>
  );
}
