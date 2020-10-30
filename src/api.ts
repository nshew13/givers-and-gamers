import { API_KEY, API_SUFFIX, API_URL } from '../api-key.secret';
import { Endpoint, EndpointMethods } from './gg-data';
import jqXHR = JQuery.jqXHR;

export class MyApi {
    public getEvents (params?: object) {
        return this._callApi(Endpoint.EVENT_LIST, params);
    }

    public getPledges (params?: object) {
        return this._callApi(Endpoint.PLEDGE_LIST, params);
    }

    private _callApi (endpoint: Endpoint, params?: object): jqXHR {
        const data = Object.assign({ token: API_KEY }, params);

        return $.ajax({
            method: EndpointMethods[endpoint],
            url: API_URL + endpoint + API_SUFFIX,
            data: data,
            // success: (result) => { outputJQO.html(JSON.stringify(result, null, 2)); },
            dataType: 'json'
        });
    }
}
