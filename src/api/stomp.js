import SockJS from "sockjs-client";
import {socketUrl} from "../data/constants/env_constants";
import Stomp from "stompjs";

export function newStompClient() {
  const socket = new SockJS(socketUrl);
  const stomp = Stomp.over(socket);
  stomp.debug = f => f;
  return stomp;
}