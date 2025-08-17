import React, { useEffect, useRef } from "react";

const JitsiEmbed = ({ roomName, onClose }) => {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: 500,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    apiRef.current.addEventListener("readyToClose", () => {
      onClose();
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomName, onClose]);

  return <div ref={jitsiContainerRef} style={{ height: 500, width: "100%" }} />;
};

export default JitsiEmbed;
