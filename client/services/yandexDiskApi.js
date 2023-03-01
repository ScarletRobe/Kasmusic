import axios from 'axios';
const YA_DISK_BASE_URL = 'https://cloud-api.yandex.net/v1/disk';
const YA_DISK_RESOURCES_URL = YA_DISK_BASE_URL + '/resources';
import * as uuid from 'uuid';

class HttpError extends Error {
  code;
  headers;
  originalError;
  message;
  isHttpError;

  constructor(data) {
    super(data.message);
    this.isHttpError = true;
    this.message = data.message;
    this.name = 'HttpError';
    this.code = data.code;
    this.headers = data.headers;
    this.originalError = data.originalError;
  }
}
class HttpClient {
  _client;
  constructor(authToken, baseUrl) {
    const client = axios.create({
      baseURL: baseUrl,
    });
    if (authToken) {
      client.defaults.maxBodyLength = Infinity;
      client.defaults.maxContentLength = Infinity;
      client.defaults.maxRedirects = 0;
    }
    this._client = client;
  }
  setAuthToken(token) {
    this._client.defaults.headers.common.Authorization = token;
  }
  async request(params) {
    let _a, _b, _c, _d, _e, _f, _g;
    try {
      const result = await this._client.request({
        url: params.url,
        method: params.method,
        data: params.body,
        params: params.params,
        headers: params.headers,
      });
      return {
        data: result.data,
        headers: result.headers,
      };
    } catch (e) {
      if (!this._isInternalHttpClientError(e)) {
        throw e;
      }
      throw new HttpError({
        originalError: e,
        headers:
          (_b = (_a = e.response) == null ? void 0 : _a.headers) != null
            ? _b
            : {},
        code: (_c = e.response) == null ? void 0 : _c.status,
        message: JSON.stringify(
          (_g =
            (_f = (_d = e.response) == null ? void 0 : _d.data) != null
              ? _f
              : (_e = e.response) == null
              ? void 0
              : _e.statusText) != null
            ? _g
            : e.message,
          null,
          2,
        ),
      });
    }
  }
  isHttpError(e) {
    return e.isHttpError;
  }
  _isInternalHttpClientError(e) {
    return e.isAxiosError;
  }
}
class YaDisk {
  _http;
  _token;
  constructor(token) {
    this._token = token;
    this._http = new HttpClient(token, YA_DISK_BASE_URL);
  }
  get token() {
    return this._token;
  }
  set token(token) {
    this._token = token;
    this._http.setAuthToken(token);
  }
  async getUploadUrl(params) {
    const res = await this._http.request({
      url: `${YA_DISK_RESOURCES_URL}/upload?path=${params.path}`,
      method: 'GET',
      params: { overwrite: params.overwrite },
      headers: {
        Authorization: this.token,
      },
    });
    return res.data;
  }
  async uploadByUploadUrl(params) {
    const res = await this._http.request({
      url: params.url,
      method: 'PUT',
      body: params.file,
    });
    return res.data;
  }
  async upload(params) {
    const { href: url } = await this.getUploadUrl({
      path: params.path,
      overwrite: params.overwrite,
    });
    return await this.uploadByUploadUrl({
      url,
      file: params.file,
    });
  }
  async getDownloadUrl(fileName, type) {
    const path = `music-platform%2F${type}%2F${fileName}`;
    const res = await this._http.request({
      method: 'GET',
      url: `${YA_DISK_RESOURCES_URL}/download?path=${path}`,
      headers: {
        Authorization: this.token,
      },
    });
    return res.data;
  }
  isHttpError(e) {
    return this._http.isHttpError(e);
  }
}

export const uploadFile = async (disk, file, type) => {
  const fileExtension = file.name.split('.').pop();
  const fileName = uuid.v4() + '.' + fileExtension;
  const path = `music-platform%2F${type}%2F${fileName}`;
  await disk.upload({ path, file });
  const fileUrl = await disk.getDownloadUrl(fileName, type);
  return { url: fileUrl.href, name: fileName };
};

export { HttpError, YaDisk };
