import { TracklassTask, Trackless } from "./index";
const w = window as Window & { TracklessQueue: TracklassTask[] };
Trackless.processQueue(w.TracklessQueue);
w.TracklessQueue = [];
