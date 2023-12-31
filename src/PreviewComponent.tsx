import React, { useState, useEffect } from "react";
import axios from "axios";
import download from "./assets/download.png";
// import email from "./assets/email.png";
import QRCode from "react-qr-code";
type PreviewComponentProps = {
  formData: FormData;
};
const PreviewComponent: React.FC<PreviewComponentProps> = ({ formData }) => {
  const [image, setImage] = useState("");
  const [qr, setQr] = useState("");
  
useEffect(() => {
    const sendFormData = async () => {
      try {
        console.log(formData.get("target_image"));
        console.log(formData.get("input_image"));

        const response = await axios.post("https://ai-photobooth.cyclic.cloud/faceswap", formData);

        setImage(response.data.image);

        // Clear the formData after the request
        formData.delete("target_image");
        formData.delete("input_image");
      } catch (error) {
        console.error("Error sending formData:", error);
      }
    };

    // Trigger the formData submission when formData changes
    if (formData.get("target_image") && formData.get("input_image")) {
      sendFormData();
    }
  }, [formData]);

  return (
    <div className="flex-1 w-full flex justify-center items-center flex-col">
      <div className="flex-1 max-w-[75%] border-black rounded-3xl p-1 flex justify-center items-center">
        <div className="flex-1 max-w-[75%] p-1 justify-center items-center flex">
          {!qr ? (
            <img
              src={
                image ||
                "https://cdnl.iconscout.com/lottie/premium/thumb/loading-shapes-5391802-4514914.gif"
              }
              className="w-full max-h-[35rem] object-contain rounded-3xl "
              alt=""
            />
          ) : (
            <div className="bg-white ">
              <QRCode value={qr} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center gap-10 mt-5">
        <button
          onClick={() => {
            if (qr) {
              setQr("");
              return;
            } else {
              setQr(image);
            }
          }}
          className="h-24 w-24 bg-black rounded-full flex justify-center items-center"
        >
          <p className="text-white font-bold text-3xl">QR</p>
        </button>
        <button
          onClick={async () => {
            const response = await axios.get(image, {
              responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "HSBCGoKapture.jpeg";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="h-24 w-24 bg-black rounded-full flex justify-center items-center "
        >
          <img src={download} className="h-14 w-14" />
        </button>
      </div>
      <button
        onClick={() => {
          window.location.reload();
		  formData.delete("target_image");
        formData.delete("input_image")
        }}
        className="mt-4 py-2 px-6 bg-black text-white rounded-3xl text-xl font-semibold relative overflow-hidden"
      >
        Re Generate
      </button>
    </div>
  );
};

export default PreviewComponent;
