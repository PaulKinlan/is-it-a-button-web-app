import { useState, useEffect } from 'preact/hooks';

type Prediction = {
  classname: string;
  score: Number;
};

type PredictionResult = {
  prediction: Prediction;
  fileUrl: string;
}

const renderPredictions = (predictionResults: PredictionResult[]) => {
  return (
  <table>
    <thead>
      <th>Image</th><th>Prediction</th><th>Confidence</th>
    </thead>
    <tbody>
      {predictionResults.map(({ prediction, fileUrl }) => <tr>
        <td>{<img src={fileUrl} />}</td>
        <td>{prediction.classname}</td>
        <td>{(prediction.score * 100).toFixed(2)}%</td></tr>)}
    </tbody></table>);
}

const analyse = (file: string, model): Promise<Prediction> => {
  return new Promise<Prediction>((resolve) => {
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.onload = async () => {
      canvas.width = 256;
      canvas.height = 256;

      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, 256, 256);

      // tf is a global.
      const normalizedData = tf.tidy(() => {
        //convert the image data to a tensor
        const imgData = context.getImageData(0, 0, 256, 256);
        let tensor = tf.browser.fromPixels(imgData, 1);
        // Normalize the image
        const offset = tf.scalar(255.0);
        const normalized = tensor.div(offset);
        //We add a dimension to get a batch shape
        const batched = normalized.expandDims(0);

        return batched;
      });

      const predTensor = model.predict(normalizedData)
      const predSoftmax = predTensor.softmax();

      const data = await predSoftmax.data();

      const max = Math.max(...data);
      const maxIdx = data.indexOf(max);

      const classes = {
        0: "Button",
        1: "Text Link"
      };

      resolve({ classname: classes[maxIdx], score: max })
    };

    img.src = file;
  })
};

export function TensorFlow({ url, files }) {
  const [model, setModel] = useState();
  const [predictions, setPredictions] = useState();

  useEffect(async () => {
    const newModel = await tf.loadLayersModel(url);

    setModel(newModel);
  }, [url]); // When the URL changes, refetch the model

  useEffect(async () => {
    console.log("Analysing", files);

    const predictionsResults: PredictionResult[] = []
    for (const file of files) {
      const fileUrl = URL.createObjectURL(file)
      predictionsResults.push({ prediction: await analyse(fileUrl, model), fileUrl });
    }

    setPredictions(predictionsResults);
  }, [files]);

  return (
    <div>
      <h2>Prediction </h2>
      <div>{model == null ? 'Loading Model' : (predictions != null) ? renderPredictions(predictions) : ''}</div>
    </div>
  );
}


