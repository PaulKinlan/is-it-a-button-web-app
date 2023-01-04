import { JSX, Component } from "preact";
import { useState, useEffect } from 'preact/hooks';
import { IS_BROWSER } from "$fresh/runtime.ts";

export function TensorFlow({ url, file }) {
  const [model, setModel] = useState();

  const [prediction, setPrediction] = useState();

  useEffect(async () => {
    const weightUrlConverter = (url) => {
      console.log("Loading Models", url);
      const paths = {
        "group1-shard1of4.bin":
          "/model/group1-shard1of4.bin",
        "group1-shard2of4.bin":
          "/model/group1-shard2of4.bin",
        "group1-shard3of4.bin":
          "/model/group1-shard3of4.bin",
        "group1-shard4of4.bin":
          "/model/group1-shard4of4.bin",
      };
      return paths[url] || url;
    };

    const newModel = await tf.loadLayersModel(url, { weightUrlConverter });

    setModel(newModel);
  }, [url]); // When the URL changes, refetch the model

  useEffect(() => {
    console.log("Analysing", file);

    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.onload = async () => {
      canvas.width = 256;
      canvas.height = 256;

      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, 256, 256);

      const normalizedData = tf.tidy(() => {
        //convert the image data to a tensor
        const imgData = context.getImageData(0, 0, 256, 256);
        let tensor = tf.browser.fromPixels(imgData, 3);
        // Normalize the image
        const offset = tf.scalar(255.0);
        const normalized = tensor.div(offset);
        //We add a dimension to get a batch shape
        const batched = normalized.expandDims(0);

        return batched;
      });

      const predTensor = model.predict(normalizedData)

      console.log(predTensor.print());
      const predSoftmax = predTensor.softmax();
      console.log(predSoftmax.print());

      const data = await predSoftmax.data();

      const max = Math.max(...data);
      const maxIdx = data.indexOf(max);

      const classes = {
        0: "Button",
        1: "Text Link"
      };

      setPrediction({classname: classes[maxIdx], score: max})
    };

    img.src = file;

  }, [file]);

  return (
    <div>
      <h2>Prediction </h2>
      <div>{model == null ? 'Loading Model' : (prediction != null) ? `This image most likely belongs to ${prediction.classname} with a ${(prediction.score * 100).toFixed(2)} percent confidence.` : ''}</div>
    </div>
  );
}


