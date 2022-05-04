export class pollResource {
  attempts = 0;
  abort = false;
  timeout: typeof setTimeout | null = null;
  pollFunc;
  callback;
  maxAttempts;
  waitTime;

  constructor({
    pollFunc,
    callback = () => false,
    maxAttempts = Infinity,
    waitTime = 100,
  }) {
    this.pollFunc = pollFunc;
    this.callback = callback;
    this.maxAttempts = maxAttempts;
    this.waitTime = waitTime;
  }

  poll = async (f: any) => {
    return await new Promise((resolve, _) => {
      this.timeout = setTimeout(async () => {
        var res = await f();
        this.callback(res);
        resolve("success");
      }, this.waitTime);
    });
  };

  stopPolling = () => {
    this.abort = true;
    clearTimeout(this.timeout);
  };

  startPolling = async () => {
    // call pollfunc a initial time
    var res = await this.pollFunc();
    this.callback(res);

    // start polling
    while (!this.abort && this.attempts < this.maxAttempts) {
      await this.poll(this.pollFunc);
      this.attempts++;
    }
  };
}
