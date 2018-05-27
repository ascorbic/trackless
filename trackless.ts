import { Trackless } from "./index";
const w = window as any;
const q = w.TracklessQueue;
if (q && Array.isArray(q)) {
    q.map(c => c(Trackless));
    w.TracklessQueue = [];
}
