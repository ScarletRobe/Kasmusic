import { createReadStream } from 'fs';
import axios from 'axios';
const YA_DISK_BASE_URL = 'https://cloud-api.yandex.net/v1/disk';
const YA_DISK_RESOURCES_URL = YA_DISK_BASE_URL + '/resources';
const YA_DISK_TRASH_URL = YA_DISK_BASE_URL + '/trash/resources';

class HttpError extends Error {
  code?: number;
  headers: Record<string, string>;
  originalError: any;
  message: any;
  isHttpError: boolean;

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
  private _client;
  constructor(authToken, baseUrl) {
    const client = axios.create({
      baseURL: baseUrl,
    });
    if (authToken) {
      client.defaults.headers.common.Authorization = authToken;
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
  private _http;
  private _token;
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
  async getItemMetadata(params) {
    try {
      const res = await this._http.request({
        method: 'GET',
        url: YA_DISK_RESOURCES_URL,
        params: {
          path: params.path,
          limit: params.limit,
          media_type: params.mediaType,
          offset: params.offset,
          preview_crop: params.previewCrop,
          preview_size: params.previewSize,
          sort: params.sort,
          fields: params.fields,
        },
      });
      return res.data;
    } catch (e) {
      if (this._http.isHttpError(e) && e.code === 404) {
        return null;
      } else throw e;
    }
  }
  async isItemExist(params) {
    const item = await this.getItemMetadata({
      path: params.path,
      fields: 'type',
    });
    if (!item) return false;
    else if (!params.type) return true;
    else return item.type === params.type;
  }
  isFileExist(path) {
    return this.isItemExist({ path, type: 'file' });
  }
  isDirExist(path) {
    return this.isItemExist({ path, type: 'dir' });
  }
  async remove(params) {
    const res = await this._http.request({
      url: `${YA_DISK_RESOURCES_URL}?path=${params.path}`,
      method: 'DELETE',
      params: {
        permanently: params.permanently,
        force_async: params.forceAsync,
      },
    });
    return res.data;
  }
  async getUploadUrl(params) {
    const res = await this._http.request({
      url: `${YA_DISK_RESOURCES_URL}/upload?path=${params.path}`,
      method: 'GET',
      params: { overwrite: params.overwrite },
    });
    return res.data;
  }
  async uploadByUploadUrl(params) {
    let body;
    if (typeof params.file === 'string') {
      body = createReadStream(params.file, 'binary');
    } else {
      body = params.file;
    }
    const res = await this._http.request({
      url: params.url,
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: body.buffer,
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
  async getMetaInfo(url) {
    const res = await this._http.request({
      url,
      method: 'GET',
    });
    return res;
  }
  async publish(params) {
    const res = await this._http.request({
      url: `${YA_DISK_RESOURCES_URL}/publish?path=${params.path}`,
      method: 'PUT',
    });
    return res.data;
  }
  async getDownloadUrl(params) {
    const res = await this._http.request({
      method: 'GET',
      url: `${YA_DISK_RESOURCES_URL}/download?path=${params.path}`,
    });
    return res.data;
  }
  async clearTrash() {
    const res = await this._http.request({
      method: 'DELETE',
      url: YA_DISK_TRASH_URL,
    });
    return res.data;
  }
  isHttpError(e) {
    return this._http.isHttpError(e);
  }
}

export { HttpError, YaDisk };
