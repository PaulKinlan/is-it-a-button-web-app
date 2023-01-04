onload = async () => {
  const url = "model.json";
  const weightUrlConverter = (url) => {
    console.log(url);
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

  const model = await tf.loadLayersModel(url, { weightUrlConverter });

  console.log(model);

  const submitButton = document.getElementById("check");

  check.onchange = async (event) => {
    const { files } = event.target;

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
        let tensor = tf.browser.fromPixels(imgData, (numChannels = 3));
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

      console.log(max, maxIdx);

    };

    img.src = URL.createObjectURL(files[0]);
  };
};
