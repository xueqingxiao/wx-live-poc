import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "react-use";
import { useAgoraRTC, useJoin, useSubscribe } from "./agora-rtc-sdk-ng";
import { fetchSession, fetchWxSign } from "./api";

const LiveNG = () => {
  const { id } = useParams<{ id: string }>();
  const session = useAsync(() => fetchSession(id));
  const wxSign = useAsync(() => fetchWxSign());
  const ref = useRef<HTMLDivElement>(null);
  const [rtcClient] = useAgoraRTC();
  useSubscribe(rtcClient, ref);
  const [localId, setLocalId] = useState<string>();
  useJoin(rtcClient, {
    appId: session.value?.data.agora.appId,
    token: session.value?.data.agora.token,
    channel: session.value?.data.agora.channel,
    uid: session.value?.data.agora.uid,
  });
  useEffect(() => {
    if (!wxSign.value) {
      return;
    }
    window.wx.config({
      ...wxSign.value.data,
      debug: false,
      jsApiList: ["startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice"],
    });
  }, [wxSign]);
  // const handlePause = () => {
  //   console.log(remoteTracks);
  //   remoteTracks.forEach((track) => {
  //     track.stop();
  //   });
  // };

  // const handleResume = () => {
  //   remoteTracks.forEach((track) => {
  //     if (ref.current) {
  //       track.play(ref.current);
  //     }
  //   });
  // };

  // const handleMute = () => {
  //   remoteTracks.forEach((track) => {
  //     if (track.trackMediaType === "audio") {
  //       track.stop();
  //     }
  //   });
  // };

  // const handleUnMute = () => {
  //   remoteTracks.forEach((track) => {
  //     if (track.trackMediaType === "audio") {
  //       track.play();
  //     }
  //   });
  // };
  const handleStartRecord = () => {
    window.wx.startRecord();
    window.wx.onVoiceRecordEnd({
      complete: (resp: any) => {
        setLocalId(resp.localId);
      },
    });
  };

  const handleStopRecord = () => {
    window.wx.stopRecord({
      success: (resp: any) => {
        setLocalId(resp.localId);
      },
      error: console.log,
    });
  };

  const handlePlayRecord = () => {
    window.wx.playVoice({ localId });
  };
  return (
    <>
      <div id="test" style={{ height: 200 }} ref={ref}></div>
      {/* <div>
        <button onClick={handleResume}>播放</button>
        <button onClick={handlePause}>暂停</button>
        <button onClick={handleMute}>静音</button>
        <button onClick={handleUnMute}>取消静音</button>
      </div> */}
      <div>
        <button onClick={handleStartRecord}>录音</button>
        <button onClick={handleStopRecord}>停止录音</button>
        <button onClick={handlePlayRecord}>播放录音</button>
      </div>
    </>
  );
};

export default LiveNG;
