import { WebSocketClient } from "./ws";

const API_URL = import.meta.env.VITE_API_URL;
const ORIGIN = API_URL.replace(/\/$/, "").replace(/\/api$/, "");

export const ws = new WebSocketClient(ORIGIN, "/ws");

export const connectWS = () => ws.connect();
export const disconnectWS = () => ws.disconnect();

export const subscribeWS = ws.subscribe.bind(ws);
export const unsubscribeWS = ws.unsubscribe.bind(ws);

export const usersResource = (userId: number) => `users:${userId}`;
export const workoutsResource = (workoutId: number) => `workouts:${workoutId}`;
export const exercisesResource = (exerciseId: number) => `exercises:${exerciseId}`;
export const setsResource = (setId: number) => `sets:${setId}`;
export const subsetsResource = (subsetId: number) => `subsets:${subsetId}`;
