interface CallEndpointProps {
  url: string;
  method?: string;
  body?: object;
  decode?: any;
  contentType?: string;
  compression?: string;
}
export function callEndpoint({
  url,
  method = "GET",
  decode = (x: XMLHttpRequest) => JSON.parse(x.response),
  body = {},
  contentType = "application/json",
  compression,
}: CallEndpointProps) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {};
    xhr.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(decode(xhr));
        } else {
          console.log(xhr.response);
          reject();
        }
      }
    };
    xhr.open(method, url);
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    if (compression) xhr.setRequestHeader("Payload-Encoding", compression);

    // TODO add caching logic
    // xhr.setRequestHeader("Cache-Control", "private, max-age=180");

    xhr.send(JSON.stringify(body));
  });
}

export function getApiUrl(
  endpointObj: any,
  endpointUrl: string,
  objectId: string
) {
  var s1 = endpointUrl ? endpointUrl : "";
  var s2 = objectId ? `/${objectId}` : "";
  return `${endpointObj.serverAddress}${endpointObj.endpointPrefix}${s1}${s2}`;
}

// get the diff hours (duration) of two dates
export function diff_hours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

// append a 0 to ensure 2 digits. e.g format the number 1 to 01 a
export const formatTo2Digits = (num: number) => String(num).padStart(2, "0");
