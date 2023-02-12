// import { useState, useEffect } from 'react'
import { StillCamera, StreamCamera, Codec } from "pi-camera-connect";
import * as fs from "fs";

const stillCamera = new StillCamera();

const takePicture = async function () {
  try {
    const image = await stillCamera.takeImage();
    fs.writeFileSync("camera-pic.jpg", image);
  } catch (error) {
    console.error(error);
  }
}

// Capture 5 seconds of H264 video and save to disk
const liveStream = async () => {

  const streamCamera = new StreamCamera({
    codec: Codec.H264
  });

  const videoStream = streamCamera.createStream();

  const writeStream = fs.createWriteStream("video-stream.h264");

  videoStream.pipe(writeStream);

  await streamCamera.startCapture();

  await new Promise(resolve => setTimeout(() => resolve(), 5000));

  await streamCamera.stopCapture();
};

export default function Camera() {
  return (
    <>
      <main>
        <div>Camera footage</div>
        <button className="px-4 py-2 bg-lime-400" onClick={takePicture}>Take picture</button>
        <button className="px-4 py-2 bg-lime-400" onClick={liveStream}>Show camera footage</button>
      </main>
    </>
  )
}