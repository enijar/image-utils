import React from "react";

enum State {
  idle = "idle",
  dragging = "dragging",
  dropped = "dropped",
}

function getStateMessage(state: State) {
  switch (state) {
    case State.idle:
      return "Drag image here";
    case State.dragging:
      return "Drop image";
    case State.dropped:
      return "Image dropped";
    default:
      return null;
  }
}

async function trimWhitespace(file: File): Promise<Blob> {
  const supportedTypes = ["image/png"];
  if (!supportedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type. Supported types: ${supportedTypes.join(",")}`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = (err) => {
      reject(err);
    };
    img.onload = async () => {
      const inputCanvas = new OffscreenCanvas(img.width, img.height);
      const input = inputCanvas.getContext("2d");
      if (input === null) {
        return reject(new Error("Failed to get 2d context from input canvas"));
      }
      input.drawImage(img, 0, 0);

      const inputImageData = input.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
      const { width, height, data } = inputImageData;

      let top = height,
        bottom = 0,
        left = width,
        right = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha !== 0) {
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
      }

      // If the image is fully transparent, return the original file
      if (top > bottom || left > right) {
        resolve(file);
        return;
      }

      const trimmedWidth = right - left + 1;
      const trimmedHeight = bottom - top + 1;

      const outputCanvas = new OffscreenCanvas(trimmedWidth, trimmedHeight);
      const output = outputCanvas.getContext("2d");
      if (output === null) {
        return reject(new Error("Failed to get 2d context from output canvas"));
      }

      output.drawImage(inputCanvas, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

      outputCanvas
        .convertToBlob({ type: file.type })
        .then((blob) => {
          resolve(blob);
        })
        .catch(reject);
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function App() {
  const [state, setState] = React.useState<State>(State.idle);

  return (
    <main
      onDragOver={(event) => {
        event.preventDefault();
        setState(State.dragging);
      }}
      onDrop={async (event) => {
        event.preventDefault();
        for (const file of event.dataTransfer.files) {
          const result = await trimWhitespace(file);
          const a = document.createElement("a");
          a.href = URL.createObjectURL(result);
          a.download = file.name;
          a.click();
        }
        setState(State.dropped);
      }}
      onDragLeave={() => {
        setState(State.dragging);
      }}
    >
      {getStateMessage(state)}
    </main>
  );
}
