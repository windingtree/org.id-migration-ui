export const phone = /^[+]{0,1}[0-9\- ()/]{2,}$/;
export const uriHttp = /^(https|http){1}:\/\/([\w\d.-]+)(:(\d*))?(\/[\w\d.-?=#&%-_]*)?$/;
export const email =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-_0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const country = /^[a-zA-Z]{2,3}$/;
