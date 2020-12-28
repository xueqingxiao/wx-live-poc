import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IRemoteTrack,
} from "agora-rtc-sdk-ng";
import { RefObject, useEffect, useState } from "react";

export interface LiveConfig {
  appId: string;
  channel: string;
}

export const useAgoraRTC = () => {
  const [client, setClient] = useState<IAgoraRTCClient>();
  useEffect(() => {
    const rtcClient = AgoraRTC.createClient({
      mode: "live",
      codec: "h264",
    });
    setClient(rtcClient);
  }, [setClient]);
  return [client];
};

export interface JoinInfo {
  appId: string;
  token: string;
  channel: string;
  uid: number | string;
}

export const useJoin = (
  client?: IAgoraRTCClient,
  { appId, token, channel, uid }: Partial<JoinInfo> = {}
) => {
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (!appId || !client || !token || !channel || !uid) {
      return;
    }
    client
      .join(appId, channel, token, uid)
      .then(() => {
        setJoined(true);
      })
      .catch(() => setJoined(false));
  }, [appId, client, token, channel, uid, setJoined]);
  return [joined];
};

export const useSubscribe = (
  client?: IAgoraRTCClient,
  ref?: RefObject<HTMLElement>
): [any] => {
  const [tracks, setTracks] = useState<IRemoteTrack[]>([]);
  useEffect(() => {
    client?.on(
      "user-published",
      (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        client?.subscribe(user, mediaType).then((track) => {
          setTracks([track]);
          if (ref?.current) {
            track.play(ref.current);
          }
        });
      }
    );
  }, [client, ref]);
  return [tracks];
};
