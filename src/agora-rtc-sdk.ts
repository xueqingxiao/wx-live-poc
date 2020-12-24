import AgoraRTC, { Client } from "agora-rtc-sdk";
import { useEffect, useState } from "react";

export interface LiveConfig {
  appId: string;
  channel: string;
}

export const useLive = (appId?: string) => {
  const [client, setClient] = useState<Client>();
  useEffect(() => {
    if (!client) {
      return;
    }
    if (!window.AgoraRTS.checkSystemRequirements()) {
      alert("您的浏览器不支持 RTS！");
      return;
    } else {
      console.log("check success");
    }
    window.AgoraRTS.init(AgoraRTC, {
      wasmDecoderPath: "AgoraRTS.wasm",
      asmDecoderPath: "AgoraRTS.asm",
      /**
       * 直播模式下为了保证流畅度，拉大延迟到 5s
       */
      bufferDelay: 3000,
      maxBufferDelay: 10000,
    }).catch((e: any) => {
      if (e === "LOAD_DECODER_FAILED") {
        console.log("加载解码器失败！");
      }
    });
    window.AgoraRTS.proxy(client);
  }, [client]);
  useEffect(() => {
    if (!appId) {
      return;
    }
    const rtcClient = AgoraRTC.createClient({
      mode: "live",
      codec: "h264",
    });
    rtcClient.init(
      appId,
      () => {
        setClient(rtcClient);
      },
      console.error
    );
  }, [appId, setClient]);
  return [client];
};

export interface JoinInfo {
  token: string;
  channel: string;
  uid: number | string;
}

export const useJoin = (
  client?: Client,
  { token, channel, uid }: Partial<JoinInfo> = {}
) => {
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (!client || !token || !channel || !uid) {
      return;
    }
    client.join(
      token,
      channel,
      uid,
      undefined,
      (_uid: number) => {
        setJoined(true);
      },
      (e) => {
        console.error(e);
        setJoined(false);
      }
    );
  }, [client, token, channel, uid, setJoined]);
  return [joined];
};

export const useSubscribe = (client?: Client): [any] => {
  const [stream, setStream] = useState();
  useEffect(() => {
    client?.on("stream-added", ({ stream: rtsStream }) => {
      client.subscribe(rtsStream, { video: true, audio: true }, console.log);
    });
    client?.on("stream-subscribed", ({ stream: rtsStream }) => {
      setStream(rtsStream);
    });
  }, [client]);
  return [stream];
};
