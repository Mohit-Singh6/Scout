Here is the breakdown of the three major Promise combinators, how they handle a group of concurrent tasks, and exactly what they output.

---

### 1. `Promise.all()` — "All or Nothing"

* **The Rule:** It waits for **all** promises to succeed. If even **one** fails, the whole thing crashes immediately (fail-fast).
* **Best Use Case:** When you need a group of related tasks to all succeed for your page to work (e.g., fetching a user profile AND their settings profile simultaneously).

#### Code Example

```ts
const p1 = Promise.resolve("User Data Fetch Complete");
const p2 = Promise.resolve("Theme Settings Loaded");
const p3 = Promise.reject("Database Network Dropped"); // 💥 ONE FAILURE

Promise.all([p1, p2, p3])
  .then((data) => console.log("Success:", data))
  .catch((err) => console.log("Caught Error:", err));

```

* **Output:** `Caught Error: Database Network Dropped`
*(The successful outputs of `p1` and `p2` are completely discarded).*

---

### 2. `Promise.allSettled()` — "The Safe Harvest"

* **The Rule:** It waits for **every single promise** to finish, completely ignoring whether they succeeded or failed. It returns a structured array showing the status and result of each individual task.
* **Best Use Case:** Perfect for **Scout**! If one monitored website crashes, you still want to collect the latency metrics of the other 3 websites that worked.

#### Code Example

```ts
const p1 = Promise.resolve("ArtEcho: 200 OK");
const p2 = Promise.reject("MeetNow: TimeoutError"); // 💥 Caught safely

Promise.allSettled([p1, p2]).then((results) => console.log(results));

```

* **Output:**
```json
[
  { "status": "fulfilled", "value": "ArtEcho: 200 OK" },
  { "status": "rejected", "reason": "MeetNow: TimeoutError" }
]

```



---

### 3. `Promise.race()` — "The Fastest Sprint"

* **The Rule:** It settles as soon as **the very first promise** settles (whether it succeeds OR fails). Whoever crosses the finish line first wins, and the rest are ignored.
* **Best Use Case:** Triggering an operational fallback if an asset takes too long to respond from a slow CDN.

#### Code Example

```ts
const fastCrash = new Promise((_, reject) => setTimeout(() => reject("Fast Fail!"), 100));
const slowSuccess = new Promise((resolve) => setTimeout(() => resolve("Slow Winner"), 500));

Promise.race([fastCrash, slowSuccess])
  .then((val) => console.log(val))
  .catch((err) => console.log("Race settled with error:", err));

```

* **Output:** `Race settled with error: Fast Fail!`
*(Because the crash happened at 100ms, it beat the success at 500ms).*

---

### 📊 Summary Cheat Sheet

| Method | When does it finish? | What does it return on overall success? | What happens if one promise fails? |
| --- | --- | --- | --- |
| **`Promise.all`** | When all finish, or *any* one fails. | An array of pure raw values. | **Aborts completely** and throws the single error. |
| **`Promise.allSettled`** | Only when **all** finish. | An array of status objects. | **Nothing blocks.** It packages the failure cleanly. |
| **`Promise.race`** | When the **very first** promise settles. | The raw value/error of the fastest winner. | If the fastest item is a failure, the **whole race fails**. |