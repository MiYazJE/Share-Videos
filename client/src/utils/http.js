import axios from 'axios';
import { stringify } from 'qs';
import tokenStorage from './token-storage';
import { normalizeHttpError } from './http-error';

const DATA_BLOB_PDF = 'data:application/pdf;base64,';

function initUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
}

function getAuth() {
  return tokenStorage.extractToken(tokenStorage.JWT_TOKEN);
}

function blobToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = (event) => {
      resolve(event.target.result);
    };

    // Convert data to base64
    reader.readAsDataURL(file);
  });
}

class HttpInstance {
  constructor(URL) {
    this.instance = axios.create({
      baseURL: URL || initUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params) => stringify(params, { indices: false }),
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(normalizeHttpError(error)),
    );

    this.instance.interceptors.request.use(
      (config) => ({
        ...config,
        headers: {
          ...config.headers,
          Authorization: getAuth(),
        },
      }),
      (error) => Promise.reject(normalizeHttpError(error)),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  dataURItoBlob({ data }) {
    let byteString;
    if (data.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(data.split(',')[1]);
    } else {
      byteString = unescape(data.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  async get(url, options = {}) {
    const result = await this.instance.get(url, options);
    return result.data === undefined ? null : result.data;
  }

  async post(url, body, options = {}) {
    const result = await this.instance.post(url, body, options);
    return result.data === undefined ? null : result.data;
  }

  async put(url, body, options = {}) {
    const result = await this.instance.put(url, body, options);
    return result.data === undefined ? null : result.data;
  }

  async patch(url, body, options = {}) {
    const result = await this.instance.patch(url, body, options);
    return result.data === undefined ? null : result.data;
  }

  async delete(url, options = {}) {
    const result = await this.instance.delete(url, options);
    return result.data === undefined ? null : result.data;
  }

  async download(url, body, options = {}) {
    const result = await this.instance.post(url, body, options);

    return this.dataURItoBlob(
      options.downloadType !== 'bucket'
        ? result && result.data
        : { data: `${DATA_BLOB_PDF}${result && result.data}` },
    );
  }

  async downloadBlob(url, options = {}) {
    const result = await this.instance.get(url, { ...options, responseType: 'blob' });
    return result.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async blobToB64(file) {
    const result = await axios.get(file, { responseType: 'blob' });
    const data = await blobToBase64(result.data);
    return data;
  }
}

export default HttpInstance;
