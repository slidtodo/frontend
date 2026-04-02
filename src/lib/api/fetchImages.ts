import { apiRequest } from './utils';

type ImagePresignedResponse = {
  uploadUrl: string;
  url: string;
};

class FetchImages {
  getPresignedUrl = (fileName: string) =>
    apiRequest<ImagePresignedResponse, { fileName: string }>('/api/v1/images', {
      method: 'POST',
      body: { fileName },
    });
}

const fetchImages = new FetchImages();
export { fetchImages };
