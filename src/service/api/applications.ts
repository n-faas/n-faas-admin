import { request } from '../request';

export function fetchApplications(params: Api.Applications.GetApplicationsParams) {
  return request<Api.Applications.GetApplicationsResponse>({
    url: '/applications',
    method: 'get',
    params
  });
}

export const createApplication = (params: Api.Applications.CreateApplicationRequest) => {
  return request<Api.Applications.CreateApplicationResponse>({
    url: '/applications',
    method: 'post',
    data: params
  });
};

export const updateApplicationService = (params: Api.Applications.UpdateApplicationRequest) => {
  return request<Api.Applications.UpdateApplicationResponse>({
    url: `/applications/${params.id}`,
    method: 'put',
    data: params
  });
};
