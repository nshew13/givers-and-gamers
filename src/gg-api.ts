import { API_KEY, API_SUFFIX, API_URL } from '../api-key.secret';
import { Endpoint, EndpointMethods } from './gg-data';
import * as $ from 'jquery';
import jqXHR = JQuery.jqXHR;

export class GGApi {
    public listTransactions (params?: object): jqXHR {
        return this.callApi(Endpoint.TRANSACTION_LIST, {
            filterValue: 'Winson'
        });
    }

    public callApi (endpoint: Endpoint, params?: object): jqXHR {
        const data = Object.assign({ token: API_KEY }, params);

        return $.ajax({
            method: EndpointMethods[endpoint],
            url: API_URL + endpoint + API_SUFFIX,
            data: data,
            dataType: 'json'
        });
    }
}
