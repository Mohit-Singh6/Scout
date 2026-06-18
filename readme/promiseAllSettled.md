No, **`Promise.allSettled()` does not run or call the functions.** By the time you pass your array into `Promise.allSettled()`, the functions **have already been called** and the network requests are already flying through the ether.

Here is the exact sequence of events:

1. **The Launch (`.map`):** When your code runs `routes.map(...)`, it invokes `pingSingleRoute()` for each item. This line **instantly executes** the code, clicks the stopwatch, and shoots the HTTP requests out to Render.
2. **The Wait (`Promise.allSettled`):** `Promise.allSettled()` is just a **glorified waiting room**. It doesn't start anything new. It simply sits there, holds the execution gate open, and watches the active background tasks that `.map` started.

Think of it like launching 4 model rockets into the sky at the exact same time:

* **`.map()`** is you physically pushing the launch button on all 4 rockets simultaneously. They are now actively flying.
* **`Promise.allSettled()`** is you putting on a pair of binoculars and waiting until every single one of those rockets either successfully lands or crashes back down to earth so you can write down the final score.