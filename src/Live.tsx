import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "react-use";
import { useJoin, useLive, useSubscribe } from "./agora-rtc-sdk";
import { fetchSession, fetchWxSign } from "./api";

const Live = () => {
  const { id } = useParams<{ id: string }>();
  const session = useAsync(() => fetchSession(id));
  const wxSign = useAsync(() => fetchWxSign());
  const [liveClient] = useLive(session.value?.data.agora.appId);
  const [stream] = useSubscribe(liveClient);
  useJoin(liveClient, {
    token: session.value?.data.agora.token,
    channel: session.value?.data.agora.channel,
    uid: session.value?.data.agora.uid,
  });
  useEffect(() => {
    if (!stream || stream.isPlaying()) {
      return;
    }
    stream.play("test");
  }, [stream]);
  useEffect(() => {
    if (!wxSign.value) {
      return;
    }
    window.wx.config({ ...wxSign.value.data, debug: false, jsApiList: ['startRecord','stopRecord'] });
  }, [wxSign]);
  const handlePause = () => {
    console.log(stream);
    stream.stop();
  };

  const handleResume = () => {
    console.log(stream);
    stream.play("test");
  };

  const handleMute = () => {
    console.log(stream);
    stream.muteAudio();
  };
  const handleUnMute = () => {
    stream.unmuteAudio();
  };
  const handleStartRecord = () => {
    window.wx.startRecord();
  };

  const handleStopRecord = () => {
    window.wx.stopRecord({
      success: console.log,
      error: console.log,
    });
  };
  return (
    <>
      <div id="test" style={{ height: 200 }}></div>
      <div>
        <button onClick={handlePause}>暂停</button>
        <button onClick={handleResume}>播放</button>
        <button onClick={handleMute}>静音</button>
        <button onClick={handleUnMute}>取消静音</button>
      </div>
      <div>
        <button onClick={handleStartRecord}>录音</button>
        <button onClick={handleStopRecord}>停止录音</button>
      </div>
    </>
  );
};

export default Live;
